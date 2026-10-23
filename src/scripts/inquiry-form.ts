import {
  buildMessage,
  todayIso,
  validateInquiry,
  whatsappUrl,
  type InquiryField,
  type InquiryInput,
  type Lang,
} from '../lib/inquiry';
import { STRINGS } from '../i18n/strings';

const FIELDS: InquiryField[] = ['name', 'checkIn', 'checkOut', 'guests', 'message'];

export function initInquiryForm(): void {
  const form = document.querySelector<HTMLFormElement>('#inquiry');
  if (!form) return;

  const lang: Lang = form.dataset.lang === 'en' ? 'en' : 'es';
  const phone = form.dataset.phone ?? '';
  const t = STRINGS[lang].contact;

  const inputs = new Map<InquiryField, HTMLInputElement | HTMLTextAreaElement>();
  for (const f of FIELDS) {
    const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-field="${f}"]`);
    if (el) inputs.set(f, el);
  }
  const summary = form.querySelector<HTMLElement>('#form-summary');
  const status = form.querySelector<HTMLElement>('.form__status');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  // Fechas mínimas: hoy para la llegada; la salida, un día después de la llegada.
  const today = todayIso();
  const checkIn = inputs.get('checkIn');
  const checkOut = inputs.get('checkOut');
  if (checkIn instanceof HTMLInputElement) checkIn.min = today;
  if (checkOut instanceof HTMLInputElement) checkOut.min = today;
  checkIn?.addEventListener('change', () => {
    if (!(checkOut instanceof HTMLInputElement) || !checkIn.value) return;
    const next = new Date(`${checkIn.value}T12:00:00`);
    next.setDate(next.getDate() + 1);
    checkOut.min = todayIso(next);
  });

  const read = (): InquiryInput => ({
    name: inputs.get('name')?.value ?? '',
    checkIn: inputs.get('checkIn')?.value ?? '',
    checkOut: inputs.get('checkOut')?.value ?? '',
    guests: inputs.get('guests')?.value ?? '',
    message: inputs.get('message')?.value ?? '',
  });

  const showErrors = (errors: Partial<Record<InquiryField, keyof typeof t.errors>>): void => {
    let first: HTMLElement | null = null;
    for (const f of FIELDS) {
      const input = inputs.get(f);
      if (!input) continue;
      const box = form.querySelector<HTMLElement>(`#${input.id}-error`);
      const code = errors[f];
      if (code) {
        input.setAttribute('aria-invalid', 'true');
        if (box) {
          box.textContent = t.errors[code];
          box.hidden = false;
        }
        first ??= input;
      } else {
        input.removeAttribute('aria-invalid');
        if (box) {
          box.textContent = '';
          box.hidden = true;
        }
      }
    }
    if (summary) summary.hidden = first === null;
    first?.focus();
  };

  // Al corregir un campo, su error desaparece sin esperar a enviar.
  for (const [f, input] of inputs) {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') !== 'true') return;
      const result = validateInquiry(read());
      if (result.ok || !result.errors[f]) {
        input.removeAttribute('aria-invalid');
        const box = form.querySelector<HTMLElement>(`#${input.id}-error`);
        if (box) box.hidden = true;
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = validateInquiry(read());
    if (!result.ok) {
      showErrors(result.errors);
      return;
    }
    showErrors({});

    const url = whatsappUrl(phone, buildMessage(result.value, lang));
    if (submit) {
      submit.disabled = true;
      submit.textContent = submit.dataset.busy ?? '';
    }
    // Respaldo visible desde ya, por si el navegador bloquea la redirección automática.
    // Los datos del formulario no se borran.
    if (status) {
      const link = document.createElement('a');
      link.href = url;
      link.rel = 'noopener';
      link.target = '_blank';
      link.className = 'textlink';
      link.textContent = status.dataset.link ?? 'WhatsApp';
      status.replaceChildren(document.createTextNode(`${status.dataset.opened ?? ''} `), link);
    }
    const reset = (): void => {
      if (!submit) return;
      submit.disabled = false;
      submit.textContent = submit.dataset.label ?? '';
    };
    window.setTimeout(reset, 1500);
    // Al volver con "Atrás" desde la caché del navegador, el botón queda listo otra vez.
    window.addEventListener('pageshow', reset, { once: true });
    window.location.href = url;
  });
}
