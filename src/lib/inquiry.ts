/**
 * Lógica de la consulta de disponibilidad: validación y armado del mensaje
 * de WhatsApp. Módulo puro (sin DOM) para poder probarlo de forma aislada.
 */

export type Lang = 'es' | 'en';

/** Pasadía (un día, 9:30 a. m. a 6:00 p. m.) o estadía (con noches). */
export type VisitKind = 'pasadia' | 'estadia';

export interface InquiryInput {
  kind: string;
  name: string;
  checkIn: string; // YYYY-MM-DD (en pasadía es la fecha del día)
  checkOut: string; // YYYY-MM-DD (solo estadía)
  guests: string;
  tents: boolean;
  message: string;
}

export interface Inquiry {
  kind: VisitKind;
  name: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  tents: boolean;
  message: string;
}

export type InquiryField = 'kind' | 'name' | 'checkIn' | 'checkOut' | 'guests' | 'message';

export type InquiryError =
  | 'required'
  | 'invalidDate'
  | 'pastDate'
  | 'checkOutBeforeCheckIn'
  | 'tooLong'
  | 'invalidGuests'
  | 'guestsOverDay'
  | 'guestsOverNight';

export type ValidationResult =
  | { ok: true; value: Inquiry }
  | { ok: false; errors: Partial<Record<InquiryField, InquiryError>> };

export const LIMITS = {
  nameMax: 80,
  messageMax: 500,
  guestsMin: 1,
  /** Máximo de personas por tipo de visita, según las tarifas del rancho. */
  guestsMax: { pasadia: 45, estadia: 16 } satisfies Record<VisitKind, number>,
} as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isVisitKind(value: string): value is VisitKind {
  return value === 'pasadia' || value === 'estadia';
}

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

  const kind = isVisitKind(input.kind) ? input.kind : null;
  if (!kind) errors.kind = 'required';

  const name = clean(input.name);
  if (!name) errors.name = 'required';
  else if (name.length > LIMITS.nameMax) errors.name = 'tooLong';

  const todayDay = parseIsoDate(today);
  const inDay = input.checkIn ? parseIsoDate(input.checkIn) : null;

  if (!input.checkIn) errors.checkIn = 'required';
  else if (inDay === null) errors.checkIn = 'invalidDate';
  else if (todayDay !== null && inDay < todayDay) errors.checkIn = 'pastDate';

  // La salida solo aplica a la estadía; en pasadía se ignora.
  if (kind === 'estadia') {
    const outDay = input.checkOut ? parseIsoDate(input.checkOut) : null;
    if (!input.checkOut) errors.checkOut = 'required';
    else if (outDay === null) errors.checkOut = 'invalidDate';
    else if (inDay !== null && outDay <= inDay) errors.checkOut = 'checkOutBeforeCheckIn';
  }

  const guestsText = input.guests.trim();
  const guests = Number(guestsText);
  if (!guestsText) errors.guests = 'required';
  else if (!Number.isInteger(guests) || guests < LIMITS.guestsMin) errors.guests = 'invalidGuests';
  else if (kind === 'pasadia' && guests > LIMITS.guestsMax.pasadia) errors.guests = 'guestsOverDay';
  else if (kind === 'estadia' && guests > LIMITS.guestsMax.estadia) errors.guests = 'guestsOverNight';

  const message = clean(input.message);
  if (message.length > LIMITS.messageMax) errors.message = 'tooLong';

  if (Object.keys(errors).length > 0 || !kind) return { ok: false, errors };
  return {
    ok: true,
    value: {
      kind,
      name,
      checkIn: input.checkIn,
      checkOut: kind === 'estadia' ? input.checkOut : '',
      guests,
      tents: input.tents,
      message,
    },
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
  const es = lang === 'es';
  const lines: string[] = [];
  if (inquiry.kind === 'pasadia') {
    lines.push(
      es
        ? `Hola, soy ${inquiry.name}. Me interesa un pasadía en Rancho Villa María.`
        : `Hi, I'm ${inquiry.name}. I'm interested in a day pass at Rancho Villa María.`,
      es ? `Fecha: ${formatDate(inquiry.checkIn, lang)}` : `Date: ${formatDate(inquiry.checkIn, lang)}`,
      es ? `Personas: ${inquiry.guests}` : `Guests: ${inquiry.guests}`,
    );
  } else {
    const nights = nightsBetween(inquiry.checkIn, inquiry.checkOut);
    const nightsText = es ? `${nights} ${nights === 1 ? 'noche' : 'noches'}` : `${nights} ${nights === 1 ? 'night' : 'nights'}`;
    lines.push(
      es
        ? `Hola, soy ${inquiry.name}. Me interesa una estadía en Rancho Villa María.`
        : `Hi, I'm ${inquiry.name}. I'm interested in an overnight stay at Rancho Villa María.`,
      es ? `Llegada: ${formatDate(inquiry.checkIn, lang)}` : `Check-in: ${formatDate(inquiry.checkIn, lang)}`,
      es
        ? `Salida: ${formatDate(inquiry.checkOut, lang)} (${nightsText})`
        : `Check-out: ${formatDate(inquiry.checkOut, lang)} (${nightsText})`,
      es ? `Personas: ${inquiry.guests}` : `Guests: ${inquiry.guests}`,
    );
  }
  if (inquiry.tents) {
    lines.push(es ? 'También me interesan las casas de campaña.' : "I'm also interested in the tents.");
  }
  lines.push(es ? '¿Está disponible esa fecha?' : 'Is that date available?');
  if (inquiry.message) lines.push('', inquiry.message);
  return lines.join('\n');
}

/** Normaliza el número a solo dígitos (formato internacional que exige wa.me). */
export function whatsappUrl(phoneE164Digits: string, text?: string): string {
  const digits = phoneE164Digits.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
