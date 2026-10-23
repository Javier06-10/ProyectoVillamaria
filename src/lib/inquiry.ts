/**
 * Lógica de la consulta de disponibilidad: validación y armado del mensaje
 * de WhatsApp. Módulo puro (sin DOM) para poder probarlo de forma aislada.
 */

export type Lang = 'es' | 'en';

export interface InquiryInput {
  name: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: string;
  message: string;
}

export interface Inquiry {
  name: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
}

export type InquiryField = 'name' | 'checkIn' | 'checkOut' | 'guests' | 'message';

export type InquiryError =
  | 'required'
  | 'invalidDate'
  | 'pastDate'
  | 'checkOutBeforeCheckIn'
  | 'tooLong'
  | 'invalidGuests';

export type ValidationResult =
  | { ok: true; value: Inquiry }
  | { ok: false; errors: Partial<Record<InquiryField, InquiryError>> };

export const LIMITS = {
  nameMax: 80,
  messageMax: 500,
  guestsMin: 1,
  guestsMax: 30,
} as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Devuelve la fecha como número de días desde la época, o null si no es válida. */
export function parseIsoDate(value: string): number | null {
  if (!ISO_DATE.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  const ms = Date.UTC(y, m - 1, d);
  const back = new Date(ms);
  // Rechaza fechas imposibles como 2026-02-31.
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== m - 1 || back.getUTCDate() !== d) {
    return null;
  }
  return ms / 86_400_000;
}

/** Fecha local de hoy en formato YYYY-MM-DD. */
export function todayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Quita caracteres de control y espacios sobrantes. */
function clean(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').replace(/[ \t]+/g, ' ').trim();
}

export function validateInquiry(input: InquiryInput, today: string = todayIso()): ValidationResult {
  const errors: Partial<Record<InquiryField, InquiryError>> = {};

  const name = clean(input.name);
  if (!name) errors.name = 'required';
  else if (name.length > LIMITS.nameMax) errors.name = 'tooLong';

  const todayDay = parseIsoDate(today);
  const inDay = input.checkIn ? parseIsoDate(input.checkIn) : null;
  const outDay = input.checkOut ? parseIsoDate(input.checkOut) : null;

  if (!input.checkIn) errors.checkIn = 'required';
  else if (inDay === null) errors.checkIn = 'invalidDate';
  else if (todayDay !== null && inDay < todayDay) errors.checkIn = 'pastDate';

  if (!input.checkOut) errors.checkOut = 'required';
  else if (outDay === null) errors.checkOut = 'invalidDate';
  else if (inDay !== null && outDay <= inDay) errors.checkOut = 'checkOutBeforeCheckIn';

  const guestsText = input.guests.trim();
  const guests = Number(guestsText);
  if (!guestsText) errors.guests = 'required';
  else if (!Number.isInteger(guests) || guests < LIMITS.guestsMin || guests > LIMITS.guestsMax) {
    errors.guests = 'invalidGuests';
  }

  const message = clean(input.message);
  if (message.length > LIMITS.messageMax) errors.message = 'tooLong';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: { name, checkIn: input.checkIn, checkOut: input.checkOut, guests, message },
  };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseIsoDate(checkIn);
  const b = parseIsoDate(checkOut);
  if (a === null || b === null) return 0;
  return Math.max(0, b - a);
}

const MONTHS: Record<Lang, readonly string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** "2026-12-24" → "24 dic 2026" (es) / "Dec 24, 2026" (en). Sin depender de la zona horaria. */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  const month = MONTHS[lang].at(m - 1) ?? '';
  return lang === 'es' ? `${d} ${month} ${y}` : `${month} ${d}, ${y}`;
}

export function buildMessage(inquiry: Inquiry, lang: Lang): string {
  const nights = nightsBetween(inquiry.checkIn, inquiry.checkOut);
  const arrive = formatDate(inquiry.checkIn, lang);
  const leave = formatDate(inquiry.checkOut, lang);
  const lines =
    lang === 'es'
      ? [
          `Hola, soy ${inquiry.name}. Me interesa alquilar Villa María.`,
          `Llegada: ${arrive}`,
          `Salida: ${leave} (${nights} ${nights === 1 ? 'noche' : 'noches'})`,
          `Personas: ${inquiry.guests}`,
          '¿Está disponible y cuál sería el precio?',
        ]
      : [
          `Hi, I'm ${inquiry.name}. I'm interested in renting Villa María.`,
          `Check-in: ${arrive}`,
          `Check-out: ${leave} (${nights} ${nights === 1 ? 'night' : 'nights'})`,
          `Guests: ${inquiry.guests}`,
          'Is it available, and what would the price be?',
        ];
  if (inquiry.message) lines.push('', inquiry.message);
  return lines.join('\n');
}

/** Normaliza el número a solo dígitos (formato internacional que exige wa.me). */
export function whatsappUrl(phoneE164Digits: string, text?: string): string {
  const digits = phoneE164Digits.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
