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
const valid: InquiryInput = {
  name: 'Ana Pérez',
  checkIn: '2026-12-24',
  checkOut: '2026-12-27',
  guests: '6',
  message: '',
};

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

describe('validateInquiry', () => {
  it('acepta una consulta completa y limpia los espacios', () => {
    const r = validateInquiry({ ...valid, name: '  Ana   Pérez ', message: ' Llevamos niños ' }, TODAY);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe('Ana Pérez');
      expect(r.value.guests).toBe(6);
      expect(r.value.message).toBe('Llevamos niños');
    }
  });

  it('marca los campos obligatorios vacíos', () => {
    const r = validateInquiry({ name: ' ', checkIn: '', checkOut: '', guests: '', message: '' }, TODAY);
    expect(r).toEqual({
      ok: false,
      errors: { name: 'required', checkIn: 'required', checkOut: 'required', guests: 'required' },
    });
  });

  it('no permite llegar antes de hoy', () => {
    const r = validateInquiry({ ...valid, checkIn: '2026-10-21' }, TODAY);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.checkIn).toBe('pastDate');
  });

  it('permite llegar hoy mismo', () => {
    expect(validateInquiry({ ...valid, checkIn: TODAY, checkOut: '2026-10-23' }, TODAY).ok).toBe(true);
  });

  it('exige que la salida sea posterior a la llegada', () => {
    for (const checkOut of ['2026-12-24', '2026-12-20']) {
      const r = validateInquiry({ ...valid, checkOut }, TODAY);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.errors.checkOut).toBe('checkOutBeforeCheckIn');
    }
  });

  it('valida el número de personas', () => {
    for (const guests of ['0', '31', '2.5', 'abc', '-1']) {
      const r = validateInquiry({ ...valid, guests }, TODAY);
      expect(r.ok, guests).toBe(false);
      if (!r.ok) expect(r.errors.guests).toBe('invalidGuests');
    }
  });

  it('limita la longitud del nombre y del mensaje', () => {
    const r = validateInquiry({ ...valid, name: 'a'.repeat(81), message: 'b'.repeat(501) }, TODAY);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBe('tooLong');
      expect(r.errors.message).toBe('tooLong');
    }
  });

  it('elimina caracteres de control del texto', () => {
    const r = validateInquiry({ ...valid, name: 'Ana\u0000\u0007 Pérez' }, TODAY);
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

  it('arma el mensaje en español con precio solicitado', () => {
    const r = validateInquiry({ ...valid, message: 'Llevamos niños' }, TODAY);
    if (!r.ok) throw new Error('debería ser válida');
    expect(buildMessage(r.value, 'es')).toBe(
      [
        'Hola, soy Ana Pérez. Me interesa alquilar Villa María.',
        'Llegada: 24 dic 2026',
        'Salida: 27 dic 2026 (3 noches)',
        'Personas: 6',
        '¿Está disponible y cuál sería el precio?',
        '',
        'Llevamos niños',
      ].join('\n'),
    );
  });

  it('arma el mensaje en inglés y usa singular para una noche', () => {
    const r = validateInquiry({ ...valid, checkOut: '2026-12-25' }, TODAY);
    if (!r.ok) throw new Error('debería ser válida');
    const msg = buildMessage(r.value, 'en');
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
