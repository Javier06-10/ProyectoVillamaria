import {
  buildMessage,
  todayIso,
  validateInquiry,
  whatsappUrl,
  type InquiryField,
  type InquiryInput,
  type Lang,
  type VisitKind,
} from '../lib/inquiry';
import { STRINGS } from '../i18n/strings';

/** Campos que muestran un mensaje de error propio (el tipo de visita siempre tiene un valor). */
const TEXT_FIELDS: InquiryField[] = ['name', 'checkIn', 'checkOut', 'guests', 'message'];

export function initInquiryForm(): void {
  const form = document.querySelector<HTMLFormElement>('#inquiry');
  if (!form) return;

  const lang: Lang = form.dataset.lang === 'en' ? 'en' : 'es';
  const phone = form.dataset.phone ?? '';
  const t = STRINGS[lang].contact;

  const inputs = new Map<InquiryField, HTMLInputElement | HTMLTextAreaElement>();
  for (const f of TEXT_FIELDS) {
    const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-field="${f}"]`);
    if (el) inputs.set(f, el);
  }
  const kindRadios = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="kind"]'));
  const tents = form.querySelector<HTMLInputElement>('[data-field="tents"]');
  const summary = form.querySelector<HTMLElement>('#form-summary');
  const status = form.querySelector<HTMLElement>('.form__status');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const checkInLabel = form.querySelector<HTMLElement>('label[for="f-in"]');
  const guestsHint = form.querySelector<HTMLElement>('#f-guests-hint');

  const currentKind = (): VisitKind =>
    kindRadios.find((r) => r.checked)?.value === 'pasadia' ? 'pasadia' : 'estadia';

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

  /** Ajusta el formulario al tipo de visita: pasadía usa una sola fecha y admite más personas. */
  const applyKind = (): void => {
    const kind = currentKind();
    form.dataset.kind = kind;
    form.querySelectorAll<HTMLElement>('[data-only]').forEach((el) => {
      el.hidden = el.dataset.only !== kind;
    });
    if (checkInLabel) checkInLabel.textContent = (kind === 'pasadia' ? checkInLabel.dataset.labelPasadia : checkInLabel.dataset.labelEstadia) ?? '';
    const guests = inputs.get('guests');
    if (guests instanceof HTMLInputElement) {
      guests.max = (kind === 'pasadia' ? guests.dataset.maxPasadia : guests.dataset.maxEstadia) ?? '';
    }
    if (guestsHint) guestsHint.textContent = (kind === 'pasadia' ? guestsHint.dataset.hintPasadia : guestsHint.dataset.hintEstadia) ?? '';
    // Un error de "salida" no aplica a un pasadía.
    if (kind === 'pasadia' && checkOut) clearError('checkOut');
  };
  kindRadios.forEach((r) => r.addEventListener('change', applyKind));

  // Los botones "Reservar" de las tarifas preseleccionan el tipo de visita.
  document.querySelectorAll<HTMLAnchorElement>('a[data-book]').forEach((a) => {
    a.addEventListener('click', () => {
      const radio = kindRadios.find((r) => r.value === a.dataset.book);
      if (radio) {
        radio.checked = true;
        applyKind();
      }
    });
  });

  const read = (): InquiryInput => ({
    kind: currentKind(),
    name: inputs.get('name')?.value ?? '',
    checkIn: inputs.get('checkIn')?.value ?? '',
    checkOut: inputs.get('checkOut')?.value ?? '',
    guests: inputs.get('guests')?.value ?? '',
    tents: tents?.checked ?? false,
    message: inputs.get('message')?.value ?? '',
  });

  const errorBox = (f: InquiryField): HTMLElement | null => {
    const input = inputs.get(f);
    return input ? form.querySelector<HTMLElement>(`#${input.id}-error`) : null;
  };

  function clearError(f: InquiryField): void {
    inputs.get(f)?.removeAttribute('aria-invalid');
    const box = errorBox(f);
    if (box) {
      box.textContent = '';
      box.hidden = true;
    }
  }

  const showErrors = (errors: Partial<Record<InquiryField, keyof typeof t.errors>>): void => {
    let first: HTMLElement | null = null;
    for (const f of TEXT_FIELDS) {
      const input = inputs.get(f);
      const code = errors[f];
      if (!input) continue;
      if (code) {
        input.setAttribute('aria-invalid', 'true');
        const box = errorBox(f);
        if (box) {
          box.textContent = t.errors[code];
          box.hidden = false;
        }
        first ??= input;
      } else {
        clearError(f);
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
      if (result.ok || !result.errors[f]) clearError(f);
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

  applyKind();
}
