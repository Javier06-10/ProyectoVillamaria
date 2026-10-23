import type { InquiryError, Lang } from '../lib/inquiry';

export interface Strings {
  htmlLang: string;
  locale: string;
  metaTitle: string;
  metaDescription: string;
  ogAlt: string;
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
  essentials: { title: string; ratesTitle: string; ratesLead: string; tentsNote: string; rulesNote: string; book: string; currency: string };
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
    kind: string;
    kinds: { pasadia: string; estadia: string };
    date: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    guestsHint: { pasadia: string; estadia: string };
    tents: string;
    message: string;
    optional: string;
    submit: string;
    submitting: string;
    direct: string;
    opened: string;
    openLink: string;
    email: string;
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
  metaTitle: 'Rancho Villa María — Pasadías y estadías en Las Lagunas de Nisibón',
  metaDescription:
    'Rancho Villa María en Las Lagunas de Nisibón, La Altagracia: 7 habitaciones, piscina amplia, billar, dominó, BBQ y áreas verdes. Pasadía desde RD$10,000 y estadía RD$16,000 por noche. Reserva por WhatsApp.',
  ogAlt: 'Rancho Villa María: piscina con sombrillas, tarifas de pasadía y estadía',
  skip: 'Saltar al contenido',
  tourLabel: 'Recorrido por el rancho',
  langSwitch: { label: 'English', href: 'en/', hreflang: 'en' },
  hero: {
    kicker: 'Naturaleza, comodidad y diversión en Las Lagunas de Nisibón',
    lead: '7 habitaciones, piscina amplia, billar, dominó, BBQ y áreas verdes. Para pasar el día en familia, quedarte el fin de semana o celebrar una ocasión especial.',
    cta: 'Reservar por WhatsApp',
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
    ratesTitle: 'Tarifas',
    ratesLead: 'Precios por grupo completo, no por persona.',
    tentsNote: 'Las casas de campaña tienen un costo adicional; pregúntalo al reservar.',
    rulesNote: 'Te compartimos las normas de la casa al confirmar la reserva.',
    book: 'Reservar',
    currency: 'RD$',
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
    title: 'Reserva tu fecha',
    text: 'Elige pasadía o estadía, completa los datos y se abrirá WhatsApp con el mensaje listo para enviar. Te confirmamos la disponibilidad.',
    name: 'Tu nombre',
    kind: 'Tipo de visita',
    kinds: { pasadia: 'Pasadía', estadia: 'Estadía' },
    date: 'Fecha',
    checkIn: 'Llegada',
    checkOut: 'Salida',
    guests: 'Personas',
    guestsHint: { pasadia: 'Hasta 45 personas', estadia: 'Hasta 16 personas' },
    tents: 'Me interesan las casas de campaña',
    message: 'Algo más que debamos saber',
    optional: 'opcional',
    submit: 'Abrir WhatsApp con mi consulta',
    submitting: 'Abriendo WhatsApp…',
    direct: 'Prefiero escribir directo',
    opened:
      '¿No se abrió WhatsApp? Tus datos siguen en el formulario.',
    openLink: 'Abrir WhatsApp con mi consulta',
    email: 'Correo',
    errorsSummary: 'Revisa los campos marcados.',
    errors: {
      required: 'Este dato es necesario.',
      invalidDate: 'Escribe una fecha válida.',
      pastDate: 'La fecha no puede ser antes de hoy.',
      checkOutBeforeCheckIn: 'La salida debe ser después de la llegada.',
      tooLong: 'Es demasiado largo; resúmelo un poco.',
      invalidGuests: 'Escribe un número entero de personas.',
      guestsOverDay: 'El pasadía es para un máximo de 45 personas.',
      guestsOverNight: 'La estadía es para un máximo de 16 personas.',
    },
    defaultText: 'Hola, me interesa reservar en Rancho Villa María. ¿Qué fechas tienen disponibles?',
  },
  sticky: 'Reservar fecha',
  gallery: {
    close: 'Cerrar',
    prev: 'Foto anterior',
    next: 'Foto siguiente',
    counter: (i, n) => `${i} de ${n}`,
  },
  footer: 'Rancho Villa María, Las Lagunas de Nisibón, La Altagracia, República Dominicana.',
  km: 'km',
  min: (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim() : `${m} min`),
};

const en: Strings = {
  htmlLang: 'en',
  locale: 'en_US',
  metaTitle: 'Rancho Villa María — Day passes and stays in Las Lagunas de Nisibón',
  metaDescription:
    'Rancho Villa María in Las Lagunas de Nisibón, Dominican Republic: 7 rooms, a large pool, pool table, dominoes, BBQ and green areas. Day pass from RD$10,000 and stays at RD$16,000 per night. Book on WhatsApp.',
  ogAlt: 'Rancho Villa María: pool with umbrellas, day pass and overnight rates',
  skip: 'Skip to content',
  tourLabel: 'Ranch tour',
  langSwitch: { label: 'Español', href: '../', hreflang: 'es' },
  hero: {
    kicker: 'Nature, comfort and fun in Las Lagunas de Nisibón',
    lead: '7 rooms, a large pool, pool table, dominoes, BBQ and green areas. Spend the day with family, stay the weekend or celebrate a special occasion.',
    cta: 'Book on WhatsApp',
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
    ratesTitle: 'Rates',
    ratesLead: 'Prices are for the whole group, not per person.',
    tentsNote: 'The tents cost extra; ask when you book.',
    rulesNote: 'We share the house rules when your booking is confirmed.',
    book: 'Book',
    currency: 'RD$',
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
    title: 'Book your date',
    text: 'Choose a day pass or an overnight stay, fill in your details and WhatsApp opens with your message ready to send. We’ll confirm availability.',
    name: 'Your name',
    kind: 'Type of visit',
    kinds: { pasadia: 'Day pass', estadia: 'Overnight stay' },
    date: 'Date',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Guests',
    guestsHint: { pasadia: 'Up to 45 people', estadia: 'Up to 16 people' },
    tents: 'I’m interested in the tents',
    message: 'Anything else we should know',
    optional: 'optional',
    submit: 'Open WhatsApp with my request',
    submitting: 'Opening WhatsApp…',
    direct: 'I’d rather message directly',
    opened: 'WhatsApp didn’t open? Your details are still in the form.',
    openLink: 'Open WhatsApp with my request',
    email: 'Email',
    errorsSummary: 'Check the highlighted fields.',
    errors: {
      required: 'This is required.',
      invalidDate: 'Enter a valid date.',
      pastDate: 'The date can’t be before today.',
      checkOutBeforeCheckIn: 'Check-out must be after check-in.',
      tooLong: 'That’s too long; please shorten it.',
      invalidGuests: 'Enter a whole number of guests.',
      guestsOverDay: 'The day pass is for up to 45 people.',
      guestsOverNight: 'The overnight stay is for up to 16 people.',
    },
    defaultText: 'Hi, I’d like to book at Rancho Villa María. Which dates are available?',
  },
  sticky: 'Book a date',
  gallery: {
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    counter: (i, n) => `${i} of ${n}`,
  },
  footer: 'Rancho Villa María, Las Lagunas de Nisibón, La Altagracia, Dominican Republic.',
  km: 'km',
  min: (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim() : `${m} min`),
};

export const STRINGS: Record<Lang, Strings> = { es, en };
