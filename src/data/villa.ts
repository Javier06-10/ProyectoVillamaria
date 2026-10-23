import type { Lang } from '../lib/inquiry';

/** Datos de contacto y ubicación. Única fuente de verdad. */
export const VILLA = {
  name: 'Villa María',
  /** Número de WhatsApp en formato internacional (República Dominicana: +1 809). */
  whatsapp: '18094999398',
  phoneDisplay: '+1 (809) 499-9398',
  locality: 'Las Lagunas de Nisibón',
  region: 'La Altagracia',
  country: 'DO',
  /** Búsqueda general del pueblo: la dirección exacta se comparte al confirmar. */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Las+Lagunas+de+Nisib%C3%B3n%2C+La+Altagracia',
} as const;

type Localized = Record<Lang, string>;

export interface Photo {
  file: string; // ruta relativa dentro de src/assets/fotos
  alt: Localized;
}

export interface Station {
  id: string;
  /** 'immersive': foto fija a pantalla completa con el texto pasando por encima. */
  layout?: 'immersive';
  nav: Localized;
  title: Localized;
  text: Localized;
  facts: Record<Lang, string[]>;
  photos: Photo[];
}

/** Recorrido en el orden de una visita real. La primera foto de cada estación es la principal. */
export const STATIONS: Station[] = [
  {
    id: 'llegada',
    nav: { es: 'Llegada', en: 'Arrival' },
    title: { es: 'La llegada', en: 'Arriving' },
    text: {
      es: 'Un camino de campo, un portón con su nombre y parqueo techado dentro de la propiedad.',
      en: 'A country road, a gate with its name on it, and covered parking inside the property.',
    },
    facts: {
      es: ['Parqueo techado', 'Propiedad con portón', 'Cerca del centro del pueblo'],
      en: ['Covered parking', 'Gated property', 'Close to the town centre'],
    },
    photos: [
      { file: 'llegada/llegada-01.jpg', alt: { es: 'Portón negro con el nombre Villa María y la casa al fondo', en: 'Black gate with the Villa María name and the house behind it' } },
      { file: 'llegada/llegada-02.jpg', alt: { es: 'Portón de metal con letras blancas de Villa María rodeado de vegetación', en: 'Metal gate with white Villa María letters surrounded by greenery' } },
      { file: 'llegada/llegada-03.jpg', alt: { es: 'Camino de tierra que sube hasta el portón', en: 'Dirt road leading up to the gate' } },
      { file: 'llegada/llegada-04.jpg', alt: { es: 'Flores de cayena rojas junto a la entrada', en: 'Red hibiscus flowers by the entrance' } },
      { file: 'llegada/llegada-05.jpg', alt: { es: 'Camino rural entre árboles cerca de la villa', en: 'Tree-lined country road near the villa' } },
      { file: 'llegada/llegada-06.jpg', alt: { es: 'Marquesina techada con un vehículo estacionado', en: 'Covered carport with a vehicle parked' } },
    ],
  },
  {
    id: 'casa',
    nav: { es: 'La casa', en: 'The house' },
    title: { es: 'La casa', en: 'The house' },
    text: {
      es: 'Dos niveles con columnas verde lima, galería y escalera exterior. La planta alta es un apartamento independiente para los huéspedes.',
      en: 'Two floors with lime-green columns, a porch and an outdoor staircase. The upper floor is a self-contained apartment for guests.',
    },
    facts: {
      es: ['Planta alta independiente', 'Balcón y galería', 'Luz las 24 horas'],
      en: ['Self-contained upper floor', 'Balcony and porch', 'Power 24 hours a day'],
    },
    photos: [
      { file: 'casa/casa-01.jpg', alt: { es: 'Fachada de dos niveles con columnas verde lima junto a un flamboyán', en: 'Two-story facade with lime-green columns beside a flame tree' } },
      { file: 'casa/casa-02.jpg', alt: { es: 'Galería con columnas y jardín frente a la casa', en: 'Columned porch and garden in front of the house' } },
      { file: 'casa/casa-03.jpg', alt: { es: 'Casa de dos plantas con balcón de baranda blanca', en: 'Two-story house with a white-railed balcony' } },
      { file: 'casa/casa-04.jpg', alt: { es: 'Galería de la planta baja con ventanas y plantas', en: 'Ground-floor porch with windows and plants' } },
      { file: 'casa/casa-05.jpg', alt: { es: 'Entrada de la casa a la sombra de un árbol', en: 'House entrance in the shade of a tree' } },
      { file: 'casa/casa-06.jpg', alt: { es: 'Vista lateral de la casa entre palmas', en: 'Side view of the house among palms' } },
      { file: 'casa/casa-07.jpg', alt: { es: 'Balcón de la planta alta entre ramas', en: 'Upper-floor balcony framed by branches' } },
      { file: 'casa/casa-08.jpg', alt: { es: 'Escalera exterior blanca hacia la planta alta', en: 'White outdoor staircase to the upper floor' } },
      { file: 'casa/casa-09.jpg', alt: { es: 'Planta alta y escaleras bajo un cielo azul', en: 'Upper floor and stairs under a blue sky' } },
      { file: 'casa/casa-10.jpg', alt: { es: 'Escalera exterior y puertas en la parte trasera', en: 'Outdoor staircase and doors at the back' } },
      { file: 'casa/casa-11.jpg', alt: { es: 'Detalle de la baranda blanca con rombos', en: 'Detail of the white diamond-pattern railing' } },
    ],
  },
  {
    id: 'adentro',
    nav: { es: 'Adentro', en: 'Inside' },
    title: { es: 'Adentro', en: 'Inside' },
    text: {
      es: 'Dos habitaciones con aire acondicionado, sala, cocina y baño.',
      en: 'Two air-conditioned bedrooms, a living room, a kitchen and a bathroom.',
    },
    facts: {
      es: ['2 habitaciones', 'Aire en cada habitación', 'Cocina con estufa'],
      en: ['2 bedrooms', 'Air conditioning in every room', 'Kitchen with stove'],
    },
    photos: [
      { file: 'adentro/adentro-01.jpg', alt: { es: 'Habitación con cama y ropa de cama verde', en: 'Bedroom with a bed made up in green linen' } },
      { file: 'adentro/adentro-02.jpg', alt: { es: 'Habitación con aire acondicionado sobre la cama', en: 'Bedroom with an air conditioner above the bed' } },
      { file: 'adentro/adentro-03.jpg', alt: { es: 'Cocina con gabinetes blancos, fregadero y estufa', en: 'Kitchen with white cabinets, sink and stove' } },
      { file: 'adentro/adentro-04.jpg', alt: { es: 'Detalle decorativo dentro de la casa', en: 'Decorative detail inside the house' } },
    ],
  },
  {
    id: 'vista',
    layout: 'immersive',
    nav: { es: 'La vista', en: 'The view' },
    title: { es: 'La vista', en: 'The view' },
    text: {
      es: 'Desde la terraza de la planta alta se ve el campo abierto y, al fondo, el mar.',
      en: 'From the upper-floor terrace you look out over open countryside to the sea in the distance.',
    },
    facts: {
      es: ['Terraza en la planta alta', 'Vista abierta'],
      en: ['Upper-floor terrace', 'Open view'],
    },
    photos: [
      { file: 'vista/vista-01.jpg', alt: { es: 'Vista panorámica del campo verde hasta el mar en el horizonte', en: 'Panoramic view across green countryside to the sea on the horizon' } },
      { file: 'vista/vista-02.jpg', alt: { es: 'Vista desde la villa con un flamboyán en flor', en: 'View from the villa with a flame tree in bloom' } },
      { file: 'vista/vista-03.jpg', alt: { es: 'Terraza de la planta alta con columna y baranda', en: 'Upper-floor terrace with column and railing' } },
    ],
  },
  {
    id: 'piscina',
    nav: { es: 'Piscina', en: 'Pool' },
    title: { es: 'La piscina', en: 'The pool' },
    text: {
      es: 'Piscina con sillas y sombrillas, y un baño propio en el área para no entrar mojado a la casa.',
      en: 'A pool with chairs and umbrellas, and its own bathroom so nobody has to walk into the house wet.',
    },
    facts: {
      es: ['Baño en el área de piscina', 'Sombrillas y sillas'],
      en: ['Poolside bathroom', 'Umbrellas and chairs'],
    },
    photos: [
      { file: 'piscina/piscina-01.jpg', alt: { es: 'Piscina con sillas rojas y sombrillas de colores', en: 'Pool with red chairs and colourful umbrellas' } },
      { file: 'piscina/piscina-02.jpg', alt: { es: 'Piscina vista desde arriba con borde de piedra', en: 'Pool seen from above with a stone edge' } },
      { file: 'piscina/piscina-03.jpg', alt: { es: 'Piscina rodeada de jardín y sombrillas', en: 'Pool surrounded by garden and umbrellas' } },
    ],
  },
  {
    id: 'patio',
    nav: { es: 'Patio y cabañas', en: 'Yard and cabins' },
    title: { es: 'Patio y cabañas', en: 'Yard and cabins' },
    text: {
      es: 'Dos cabañas con baño propio, columpios y un patio con palmas de coco y matas de mango.',
      en: 'Two cabins with their own bathrooms, swings, and a yard with coconut palms and mango trees.',
    },
    facts: {
      es: ['2 cabañas con baño', 'Columpios', 'Cocos y mangos'],
      en: ['2 cabins with bathroom', 'Swings', 'Coconuts and mangoes'],
    },
    photos: [
      { file: 'patio/patio-01.jpg', alt: { es: 'Cabaña de madera roja entre plantas', en: 'Red wooden cabin among plants' } },
      { file: 'patio/patio-02.jpg', alt: { es: 'Camino de grava bajo un flamboyán en el patio', en: 'Gravel path under a flame tree in the yard' } },
      { file: 'patio/patio-03.jpg', alt: { es: 'Columpios en el patio entre árboles', en: 'Swings in the yard among trees' } },
      { file: 'patio/patio-04.jpg', alt: { es: 'Jardín con palmas y césped', en: 'Garden with palms and lawn' } },
      { file: 'patio/patio-05.jpg', alt: { es: 'Palma de coco en el patio', en: 'Coconut palm in the yard' } },
      { file: 'patio/patio-06.jpg', alt: { es: 'Racimo de cocos verdes', en: 'Bunch of green coconuts' } },
      { file: 'patio/patio-07.jpg', alt: { es: 'Mangos colgando de una mata del patio', en: 'Mangoes hanging from a tree in the yard' } },
      { file: 'patio/patio-08.jpg', alt: { es: 'Cocos en la palma', en: 'Coconuts on the palm' } },
      { file: 'patio/patio-09.jpg', alt: { es: 'Plantas tropicales del jardín', en: 'Tropical plants in the garden' } },
      { file: 'patio/patio-10.jpg', alt: { es: 'Gallinas sueltas en el patio', en: 'Free-roaming chickens in the yard' } },
      { file: 'patio/patio-11.jpg', alt: { es: 'Camino entre árboles bajo un cielo azul', en: 'Path among trees under a blue sky' } },
    ],
  },
];

/** Imagen para compartir en redes: la vista panorámica. */
export const HERO_PHOTO = 'vista/vista-02.jpg';

export type AmenityIcon = 'home' | 'cabin' | 'snow' | 'bolt' | 'pool' | 'car';

export interface Amenity {
  icon: AmenityIcon;
  text: Localized;
}

export const AMENITIES: Amenity[] = [
  { icon: 'home', text: { es: 'Apartamento en planta alta: 2 habitaciones, sala, cocina y baño', en: 'Upper-floor apartment: 2 bedrooms, living room, kitchen and bathroom' } },
  { icon: 'cabin', text: { es: '2 cabañas en el patio, cada una con su baño', en: '2 cabins in the yard, each with its own bathroom' } },
  { icon: 'snow', text: { es: 'Aire acondicionado en todas las habitaciones', en: 'Air conditioning in every bedroom' } },
  { icon: 'bolt', text: { es: 'Luz las 24 horas', en: 'Power 24 hours a day' } },
  { icon: 'pool', text: { es: 'Piscina con baño propio', en: 'Pool with its own bathroom' } },
  { icon: 'car', text: { es: 'Parqueo techado dentro de la propiedad', en: 'Covered parking inside the property' } },
];

/** Fotos del pase de la portada, en orden. La primera se carga con prioridad. */
export const HERO_SLIDES = ['vista-02', 'piscina-01', 'casa-01', 'llegada-01', 'piscina-02'].map((n) => `${n.split('-')[0]}/${n}.jpg`);

/**
 * Distancias APROXIMADAS por carretera desde Las Lagunas de Nisibón.
 * Estimadas a partir de la ruta Punta Cana–Uvero Alto–Nisibón–Miches (~100 km en total).
 * Pendiente: confirmarlas con el propietario o con Google Maps antes del lanzamiento.
 */
export interface Place {
  name: Localized;
  km: number;
  minutes: number;
}

export const PLACES: Place[] = [
  { name: { es: 'Playas de Uvero Alto', en: 'Uvero Alto beaches' }, km: 20, minutes: 25 },
  { name: { es: 'Higüey y su Basílica', en: 'Higüey and its Basilica' }, km: 35, minutes: 40 },
  { name: { es: 'Playa Macao', en: 'Macao beach' }, km: 35, minutes: 45 },
  { name: { es: 'Miches y Playa Esmeralda', en: 'Miches and Esmeralda beach' }, km: 45, minutes: 50 },
  { name: { es: 'Bávaro', en: 'Bávaro' }, km: 50, minutes: 55 },
  { name: { es: 'Aeropuerto de Punta Cana', en: 'Punta Cana Airport' }, km: 60, minutes: 70 },
];
