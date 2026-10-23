import { describe, expect, it } from 'vitest';
import {
  buildMessage,
  formatDate,
  nightsBetween,
  parseIsoDate,
  validateInquiry,
  whatsappUrl,
  type InquiryInput,
} from '../../src/lib/inquiry';

const TODAY = '2026-10-22';
const stay: InquiryInput = {
  kind: 'estadia',
  name: 'Ana Pérez',
  checkIn: '2026-12-24',
  checkOut: '2026-12-27',
  guests: '12',
  tents: false,
  message: '',
};
const dayPass: InquiryInput = { ...stay, kind: 'pasadia', checkOut: '', guests: '40' };

describe('parseIsoDate', () => {
  it('acepta fechas reales', () => {
    expect(parseIsoDate('2026-02-28')).not.toBeNull();
    expect(parseIsoDate('2028-02-29')).not.toBeNull(); // año bisiesto
  });
  it('rechaza fechas imposibles o mal formadas', () => {
    expect(parseIsoDate('2026-02-31')).toBeNull();
    expect(parseIsoDate('2026-13-01')).toBeNull();
    expect(parseIsoDate('24/12/2026')).toBeNull();
    expect(parseIsoDate('')).toBeNull();
  });
});

describe('validateInquiry: estadía', () => {
  it('acepta una estadía completa y limpia los espacios', () => {
    const r = validateInquiry({ ...stay, name: '  Ana   Pérez ', message: ' Llevamos niños ' }, TODAY);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toMatchObject({ kind: 'estadia', name: 'Ana Pérez', guests: 12, message: 'Llevamos niños' });
    }
  });

  it('marca los campos obligatorios vacíos', () => {
    const r = validateInquiry({ ...stay, name: ' ', checkIn: '', checkOut: '', guests: '' }, TODAY);
    expect(r).toEqual({
      ok: false,
      errors: { name: 'required', checkIn: 'required', checkOut: 'required', guests: 'required' },
    });
  });

  it('no permite fechas anteriores a hoy, pero sí hoy mismo', () => {
    const past = validateInquiry({ ...stay, checkIn: '2026-10-21' }, TODAY);
    expect(!past.ok && past.errors.checkIn).toBe('pastDate');
    expect(validateInquiry({ ...stay, checkIn: TODAY, checkOut: '2026-10-23' }, TODAY).ok).toBe(true);
  });

  it('exige que la salida sea posterior a la llegada', () => {
    for (const checkOut of ['2026-12-24', '2026-12-20']) {
      const r = validateInquiry({ ...stay, checkOut }, TODAY);
      expect(!r.ok && r.errors.checkOut).toBe('checkOutBeforeCheckIn');
    }
  });

  it('admite hasta 16 personas', () => {
    expect(validateInquiry({ ...stay, guests: '16' }, TODAY).ok).toBe(true);
    const r = validateInquiry({ ...stay, guests: '17' }, TODAY);
    expect(!r.ok && r.errors.guests).toBe('guestsOverNight');
  });
});

describe('validateInquiry: pasadía', () => {
  it('usa una sola fecha e ignora la salida', () => {
    const r = validateInquiry({ ...dayPass, checkOut: 'basura' }, TODAY);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.checkOut).toBe('');
  });

  it('admite hasta 45 personas', () => {
    expect(validateInquiry({ ...dayPass, guests: '45' }, TODAY).ok).toBe(true);
    const r = validateInquiry({ ...dayPass, guests: '46' }, TODAY);
    expect(!r.ok && r.errors.guests).toBe('guestsOverDay');
  });
});

describe('validateInquiry: otros límites', () => {
  it('rechaza números de personas no válidos', () => {
    for (const guests of ['0', '2.5', 'abc', '-1']) {
      const r = validateInquiry({ ...stay, guests }, TODAY);
      expect(!r.ok && r.errors.guests, guests).toBe('invalidGuests');
    }
  });

  it('exige un tipo de visita conocido', () => {
    const r = validateInquiry({ ...stay, kind: 'fiesta' }, TODAY);
    expect(!r.ok && r.errors.kind).toBe('required');
  });

  it('limita la longitud del nombre y del mensaje', () => {
    const r = validateInquiry({ ...stay, name: 'a'.repeat(81), message: 'b'.repeat(501) }, TODAY);
    expect(!r.ok && r.errors).toMatchObject({ name: 'tooLong', message: 'tooLong' });
  });

  it('elimina caracteres de control del texto', () => {
    const r = validateInquiry({ ...stay, name: 'Ana\u0000\u0007 Pérez' }, TODAY);
    expect(r.ok && r.value.name).toBe('Ana Pérez');
  });
});

describe('mensaje de WhatsApp', () => {
  it('cuenta las noches', () => {
    expect(nightsBetween('2026-12-24', '2026-12-27')).toBe(3);
    expect(nightsBetween('2026-12-31', '2027-01-01')).toBe(1);
  });

  it('formatea fechas sin depender de la zona horaria', () => {
    expect(formatDate('2026-12-24', 'es')).toBe('24 dic 2026');
    expect(formatDate('2026-01-01', 'en')).toBe('Jan 1, 2026');
  });

  it('arma el mensaje de una estadía con casas de campaña', () => {
    const r = validateInquiry({ ...stay, tents: true, message: 'Llevamos niños' }, TODAY);
    if (!r.ok) throw new Error('debería ser válida');
    expect(buildMessage(r.value, 'es')).toBe(
      [
        'Hola, soy Ana Pérez. Me interesa una estadía en Rancho Villa María.',
        'Llegada: 24 dic 2026',
        'Salida: 27 dic 2026 (3 noches)',
        'Personas: 12',
        'También me interesan las casas de campaña.',
        '¿Está disponible esa fecha?',
        '',
        'Llevamos niños',
      ].join('\n'),
    );
  });

  it('arma el mensaje de un pasadía con una sola fecha', () => {
    const r = validateInquiry(dayPass, TODAY);
    if (!r.ok) throw new Error('debería ser válida');
    expect(buildMessage(r.value, 'es')).toBe(
      [
        'Hola, soy Ana Pérez. Me interesa un pasadía en Rancho Villa María.',
        'Fecha: 24 dic 2026',
        'Personas: 40',
        '¿Está disponible esa fecha?',
      ].join('\n'),
    );
  });

  it('arma el mensaje en inglés y usa singular para una noche', () => {
    const r = validateInquiry({ ...stay, checkOut: '2026-12-25' }, TODAY);
    if (!r.ok) throw new Error('debería ser válida');
    const msg = buildMessage(r.value, 'en');
    expect(msg).toContain('overnight stay at Rancho Villa María');
    expect(msg).toContain('Check-out: Dec 25, 2026 (1 night)');
    expect(msg).not.toContain('\n\n');
  });

  it('construye la URL de wa.me codificando el texto', () => {
    expect(whatsappUrl('+1 (809) 499-9398')).toBe('https://wa.me/18094999398');
    expect(whatsappUrl('18094999398', 'Hola & ¿precio?\nGracias')).toBe(
      'https://wa.me/18094999398?text=Hola%20%26%20%C2%BFprecio%3F%0AGracias',
    );
  });
});
