import type { InquiryError, Lang } from '../lib/inquiry';

export interface Strings {
  htmlLang: string;
  locale: string;
  metaTitle: string;
  metaDescription: string;
  skip: string;
  tourLabel: string;
  langSwitch: { label: string; href: string; hreflang: Lang };
  hero: { kicker: string; lead: string; cta: string; secondary: string; pause: string; play: string; };
  station: {
    seeAll: (n: number) => string;
    photosOf: (title: string) => string;
    stop: (i: number, n: number) => string;
    prev: string;
    next: string;
    slide: (i: number, n: number) => string;
    goTo: (i: number) => string;
  };
  essentials: { title: string; priceTitle: string; priceText: string; rulesNote: string };
  location: {
    title: string;
    text: string;
    distancesCaption: string;
    place: string;
    distance: string;
    time: string;
    approx: string;
    openMap: string;
    privacy: string;
  };
  contact: {
    title: string;
    text: string;
    name: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    message: string;
    optional: string;
    submit: string;
    submitting: string;
    direct: string;
    opened: string;
    openLink: string;
    errorsSummary: string;
    errors: Record<InquiryError, string>;
    defaultText: string;
  };
  sticky: string;
  gallery: { close: string; prev: string; next: string; counter: (i: number, n: number) => string };
  footer: string;
  km: string;
  min: (m: number) => string;
}

const es: Strings = {
  htmlLang: 'es-DO',
  locale: 'es_DO',
  metaTitle: 'Villa María — Casa con piscina en Las Lagunas de Nisibón',
  metaDescription:
    'Alquiler de Villa María en Las Lagunas de Nisibón, La Altagracia: 2 habitaciones con aire, 2 cabañas con baño, piscina, luz 24 horas y parqueo. Consulta fechas por WhatsApp.',
  skip: 'Saltar al contenido',
  tourLabel: 'Recorrido por la villa',
  langSwitch: { label: 'English', href: 'en/', hreflang: 'en' },
  hero: {
    kicker: 'Casa de campo con piscina en Las Lagunas de Nisibón',
    lead: 'Dos habitaciones en la planta alta, dos cabañas con baño y luz las 24 horas. Recórrela antes de llegar.',
    cta: 'Consultar fechas por WhatsApp',
    secondary: 'Empezar el recorrido',
    pause: 'Pausar fotos',
    play: 'Reanudar fotos',
  },
  station: {
    seeAll: (n) => `Ver las ${n} fotos en grande`,
    photosOf: (title) => `Fotos: ${title}`,
    stop: (i, n) => `Parada ${i} de ${n}`,
    prev: 'Foto anterior',
    next: 'Foto siguiente',
    slide: (i, n) => `${i} de ${n}`,
    goTo: (i) => `Ir a la foto ${i}`,
  },
  essentials: {
    title: 'Lo que incluye',
    priceTitle: 'Precio',
    priceText:
      'El precio depende de las fechas y del número de personas. Escríbenos por WhatsApp y te lo enviamos.',
    rulesNote: 'Te compartimos las normas de la casa al confirmar la reserva.',
  },
  location: {
    title: 'Dónde está',
    text: 'En Las Lagunas de Nisibón, provincia La Altagracia, cerca del centro del pueblo.',
    distancesCaption: 'Distancias aproximadas por carretera',
    place: 'Lugar',
    distance: 'Distancia',
    time: 'En carro',
    approx: 'Los tiempos pueden variar por el estado de la carretera.',
    openMap: 'Ver la zona en Google Maps',
    privacy: 'La dirección exacta se comparte al confirmar la reserva.',
  },
  contact: {
    title: 'Consulta tus fechas',
    text: 'Completa estos datos y se abrirá WhatsApp con el mensaje listo para enviar. Te respondemos con disponibilidad y precio.',
    name: 'Tu nombre',
    checkIn: 'Llegada',
    checkOut: 'Salida',
    guests: 'Personas',
    message: 'Algo más que debamos saber',
    optional: 'opcional',
    submit: 'Abrir WhatsApp con mi consulta',
    submitting: 'Abriendo WhatsApp…',
    direct: 'Prefiero escribir directo',
    opened:
      '¿No se abrió WhatsApp? Tus datos siguen en el formulario.',
    openLink: 'Abrir WhatsApp con mi consulta',
    errorsSummary: 'Revisa los campos marcados.',
    errors: {
      required: 'Este dato es necesario.',
      invalidDate: 'Escribe una fecha válida.',
      pastDate: 'La llegada no puede ser antes de hoy.',
      checkOutBeforeCheckIn: 'La salida debe ser después de la llegada.',
      tooLong: 'Es demasiado largo; resúmelo un poco.',
      invalidGuests: 'Escribe un número entre 1 y 30.',
    },
    defaultText: 'Hola, me interesa alquilar Villa María. ¿Qué fechas tienen disponibles y cuál es el precio?',
  },
  sticky: 'Consultar fechas',
  gallery: {
    close: 'Cerrar',
    prev: 'Foto anterior',
    next: 'Foto siguiente',
    counter: (i, n) => `${i} de ${n}`,
  },
  footer: 'Villa María, Las Lagunas de Nisibón, La Altagracia, República Dominicana.',
  km: 'km',
  min: (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim() : `${m} min`),
};

const en: Strings = {
  htmlLang: 'en',
  locale: 'en_US',
  metaTitle: 'Villa María — Country house with pool in Las Lagunas de Nisibón',
  metaDescription:
    'Rent Villa María in Las Lagunas de Nisibón, Dominican Republic: 2 air-conditioned bedrooms, 2 cabins with bathrooms, pool, 24-hour power and parking. Ask for dates on WhatsApp.',
  skip: 'Skip to content',
  tourLabel: 'Villa tour',
  langSwitch: { label: 'Español', href: '../', hreflang: 'es' },
  hero: {
    kicker: 'Country house with a pool in Las Lagunas de Nisibón',
    lead: 'Two bedrooms upstairs, two cabins with bathrooms and power around the clock. Take the tour before you arrive.',
    cta: 'Ask for dates on WhatsApp',
    secondary: 'Start the tour',
    pause: 'Pause photos',
    play: 'Play photos',
  },
  station: {
    seeAll: (n) => `See all ${n} photos full size`,
    photosOf: (title) => `Photos: ${title}`,
    stop: (i, n) => `Stop ${i} of ${n}`,
    prev: 'Previous photo',
    next: 'Next photo',
    slide: (i, n) => `${i} of ${n}`,
    goTo: (i) => `Go to photo ${i}`,
  },
  essentials: {
    title: 'What’s included',
    priceTitle: 'Price',
    priceText:
      'The price depends on your dates and group size. Message us on WhatsApp and we’ll send it to you.',
    rulesNote: 'We share the house rules when your booking is confirmed.',
  },
  location: {
    title: 'Where it is',
    text: 'In Las Lagunas de Nisibón, La Altagracia province, close to the town centre.',
    distancesCaption: 'Approximate driving distances',
    place: 'Place',
    distance: 'Distance',
    time: 'By car',
    approx: 'Times can vary with road conditions.',
    openMap: 'See the area on Google Maps',
    privacy: 'The exact address is shared once your booking is confirmed.',
  },
  contact: {
    title: 'Ask about your dates',
    text: 'Fill this in and WhatsApp opens with your message ready to send. We reply with availability and price.',
    name: 'Your name',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Guests',
    message: 'Anything else we should know',
    optional: 'optional',
    submit: 'Open WhatsApp with my request',
    submitting: 'Opening WhatsApp…',
    direct: 'I’d rather message directly',
    opened: 'WhatsApp didn’t open? Your details are still in the form.',
    openLink: 'Open WhatsApp with my request',
    errorsSummary: 'Check the highlighted fields.',
    errors: {
      required: 'This is required.',
      invalidDate: 'Enter a valid date.',
      pastDate: 'Check-in can’t be before today.',
      checkOutBeforeCheckIn: 'Check-out must be after check-in.',
      tooLong: 'That’s too long; please shorten it.',
      invalidGuests: 'Enter a number from 1 to 30.',
    },
    defaultText: 'Hi, I’m interested in renting Villa María. Which dates are available and what is the price?',
  },
  sticky: 'Ask for dates',
  gallery: {
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    counter: (i, n) => `${i} of ${n}`,
  },
  footer: 'Villa María, Las Lagunas de Nisibón, La Altagracia, Dominican Republic.',
  km: 'km',
  min: (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim() : `${m} min`),
};

export const STRINGS: Record<Lang, Strings> = { es, en };
