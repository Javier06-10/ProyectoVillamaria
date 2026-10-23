import type { Lang, VisitKind } from "../lib/inquiry";

/** Datos de contacto y ubicación. Única fuente de verdad. */
export const VILLA = {
  name: "Rancho Villa María",
  /** Parte destacada del nombre en la portada. */
  shortName: "Villa María",
  /** Número de WhatsApp en formato internacional (República Dominicana: +1 809). */
  whatsapp: "18094999398",
  phoneDisplay: "+1 (809) 499-9398",
  /** Correo del propietario para consultas que no sean por WhatsApp. */
  email: "agcastillo20@hotmail.com",
  locality: "Las Lagunas de Nisibón",
  region: "La Altagracia",
  country: "DO",
  /** Búsqueda general del pueblo: la dirección exacta se comparte al confirmar. */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Las+Lagunas+de+Nisib%C3%B3n%2C+La+Altagracia",
} as const;

type Localized = Record<Lang, string>;

export interface Photo {
  file: string; // ruta relativa dentro de src/assets/fotos
  alt: Localized;
}

export interface Station {
  id: string;
  /** 'immersive': foto fija a pantalla completa con el texto pasando por encima. */
  layout?: "immersive";
  nav: Localized;
  title: Localized;
  text: Localized;
  facts: Record<Lang, string[]>;
  photos: Photo[];
}

/** Recorrido en el orden de una visita real. La primera foto de cada estación es la principal. */
export const STATIONS: Station[] = [
  {
    id: "llegada",
    nav: { es: "Llegada", en: "Arrival" },
    title: { es: "La llegada", en: "Arriving" },
    text: {
      es: "Un camino de campo, un portón con su nombre y parqueo privado dentro del rancho.",
      en: "A country road, a gate with its name on it, and private parking inside the ranch.",
    },
    facts: {
      es: [
        "Parqueo privado",
        "Propiedad con portón",
        "Cerca del centro del pueblo",
      ],
      en: ["Private parking", "Gated property", "Close to the town centre"],
    },
    photos: [
      {
        file: "llegada/llegada-01.jpg",
        alt: {
          es: "Portón negro con el nombre Villa María y la casa al fondo",
          en: "Black gate with the Villa María name and the house behind it",
        },
      },
      {
        file: "llegada/llegada-02.jpg",
        alt: {
          es: "Portón de metal con letras blancas de Villa María rodeado de vegetación",
          en: "Metal gate with white Villa María letters surrounded by greenery",
        },
      },
      {
        file: "llegada/llegada-03.jpg",
        alt: {
          es: "Camino de tierra que sube hasta el portón",
          en: "Dirt road leading up to the gate",
        },
      },
      {
        file: "llegada/llegada-04.jpg",
        alt: {
          es: "Flores de cayena rojas junto a la entrada",
          en: "Red hibiscus flowers by the entrance",
        },
      },
      {
        file: "llegada/llegada-06.jpg",
        alt: {
          es: "Marquesina techada con un vehículo estacionado",
          en: "Covered carport with a vehicle parked",
        },
      },
    ],
  },
  {
    id: "casa",
    nav: { es: "La casa", en: "The house" },
    title: { es: "La casa", en: "The house" },
    text: {
      es: "Dos niveles con columnas verde lima, galería y escalera exterior. Espacio tranquilo y acogedor para compartir con familia y amigos.",
      en: "Two floors with lime-green columns, a porch and an outdoor staircase. A quiet, welcoming place to share with family and friends.",
    },
    facts: {
      es: [
        "Balcón y galería",
        "Luz las 24 horas",
        "Hasta 16 personas de noche",
      ],
      en: ["Balcony and porch", "Power 24 hours a day", "Sleeps up to 16"],
    },
    photos: [
      {
        file: "casa/casa-01.jpg",
        alt: {
          es: "Fachada de dos niveles con columnas verde lima junto a un flamboyán",
          en: "Two-story facade with lime-green columns beside a flame tree",
        },
      },
      {
        file: "casa/casa-02.jpg",
        alt: {
          es: "Galería con columnas y jardín frente a la casa",
          en: "Columned porch and garden in front of the house",
        },
      },
      {
        file: "casa/casa-03.jpg",
        alt: {
          es: "Casa de dos plantas con balcón de baranda blanca",
          en: "Two-story house with a white-railed balcony",
        },
      },
      {
        file: "casa/casa-04.jpg",
        alt: {
          es: "Galería de la planta baja con ventanas y plantas",
          en: "Ground-floor porch with windows and plants",
        },
      },
      {
        file: "casa/casa-05.jpg",
        alt: {
          es: "Entrada de la casa a la sombra de un árbol",
          en: "House entrance in the shade of a tree",
        },
      },
      {
        file: "casa/casa-06.jpg",
        alt: {
          es: "Vista lateral de la casa entre palmas",
          en: "Side view of the house among palms",
        },
      },
      {
        file: "casa/casa-07.jpg",
        alt: {
          es: "Balcón de la planta alta entre ramas",
          en: "Upper-floor balcony framed by branches",
        },
      },
      {
        file: "casa/casa-08.jpg",
        alt: {
          es: "Escalera exterior blanca hacia la planta alta",
          en: "White outdoor staircase to the upper floor",
        },
      },
      {
        file: "casa/casa-09.jpg",
        alt: {
          es: "Planta alta y escaleras bajo un cielo azul",
          en: "Upper floor and stairs under a blue sky",
        },
      },
      {
        file: "casa/casa-10.jpg",
        alt: {
          es: "Escalera exterior y puertas en la parte trasera",
          en: "Outdoor staircase and doors at the back",
        },
      },
    ],
  },
  {
    id: "adentro",
    nav: { es: "Habitaciones", en: "Rooms" },
    title: { es: "Habitaciones y cocina", en: "Rooms and kitchen" },
    text: {
      es: "7 habitaciones con aire acondicionado: 5 para parejas y 2 familiares. Cocina equipada para cocinar en grupo.",
      en: "7 air-conditioned rooms: 5 for couples and 2 for families. A fully equipped kitchen for cooking together.",
    },
    facts: {
      es: [
        "5 habitaciones para parejas",
        "2 habitaciones familiares",
        "Cocina equipada",
      ],
      en: ["5 rooms for couples", "2 family rooms", "Equipped kitchen"],
    },
    photos: [
      {
        file: "adentro/adentro-01.jpg",
        alt: {
          es: "Habitación con cama y ropa de cama verde",
          en: "Bedroom with a bed made up in green linen",
        },
      },
      {
        file: "adentro/adentro-02.jpg",
        alt: {
          es: "Habitación con aire acondicionado sobre la cama",
          en: "Bedroom with an air conditioner above the bed",
        },
      },
      {
        file: "adentro/adentro-03.jpg",
        alt: {
          es: "Cocina con gabinetes blancos, fregadero y estufa",
          en: "Kitchen with white cabinets, sink and stove",
        },
      },
    ],
  },
  {
    id: "vista",
    layout: "immersive",
    nav: { es: "La vista", en: "The view" },
    title: { es: "La vista", en: "The view" },
    text: {
      es: "Desde la terraza de la planta alta se ve el campo abierto y, al fondo, el mar.",
      en: "From the upper-floor terrace you look out over open countryside to the sea in the distance.",
    },
    facts: {
      es: ["Terraza en la planta alta", "Vista abierta"],
      en: ["Upper-floor terrace", "Open view"],
    },
    photos: [
      {
        file: "vista/vista-01.jpg",
        alt: {
          es: "Vista panorámica del campo verde hasta el mar en el horizonte",
          en: "Panoramic view across green countryside to the sea on the horizon",
        },
      },
      {
        file: "vista/vista-02.jpg",
        alt: {
          es: "Vista desde la villa con un flamboyán en flor",
          en: "View from the villa with a flame tree in bloom",
        },
      },
      {
        file: "vista/vista-03.jpg",
        alt: {
          es: "Terraza de la planta alta con columna y baranda",
          en: "Upper-floor terrace with column and railing",
        },
      },
    ],
  },
  {
    id: "piscina",
    nav: { es: "Piscina", en: "Pool" },
    title: { es: "La piscina", en: "The pool" },
    text: {
      es: "Piscina amplia con borde de piedra, sombrillas y un baño propio en el área para no entrar mojado a la casa.",
      en: "A large pool with a stone deck, umbrellas and its own bathroom so nobody has to walk into the house wet.",
    },
    facts: {
      es: [
        "Piscina amplia",
        "Baño en el área de piscina",
        "Sombrillas y sillas",
      ],
      en: ["Large pool", "Poolside bathroom", "Umbrellas and chairs"],
    },
    photos: [
      {
        file: "piscina/piscina-nueva-01.jpg",
        alt: {
          es: "Piscina azul con el nombre Villamaria en el fondo, vista desde la terraza",
          en: "Blue pool with the Villamaria name on the floor, seen from the terrace",
        },
      },
      {
        file: "piscina/piscina-nueva-03.jpg",
        alt: {
          es: "Piscina con sombrillas de colores y la galería al fondo",
          en: "Pool with colourful umbrellas and the porch behind it",
        },
      },
      {
        file: "piscina/piscina-nueva-02.jpg",
        alt: {
          es: "Piscina iluminada con la casa del rancho al fondo",
          en: "Lit pool with the ranch house behind it",
        },
      },
      {
        file: "piscina/piscina-01.jpg",
        alt: {
          es: "Sillas rojas y sombrillas junto a la piscina",
          en: "Red chairs and umbrellas by the pool",
        },
      },
    ],
  },
  {
    id: "patio",
    nav: { es: "Patio y juegos", en: "Yard and play" },
    title: { es: "Patio y juegos", en: "Yard and play" },
    text: {
      es: "Áreas verdes con columpios y casita de juegos para los niños, palmas de coco y matas de mango. Hay 2 casas de campaña para quien quiera dormir en contacto con la naturaleza.",
      en: "Green areas with swings and a playhouse for the kids, coconut palms and mango trees. Two tents are available for anyone who wants to sleep closer to nature.",
    },
    facts: {
      es: [
        "Columpios y casita de juegos",
        "Áreas verdes",
        "Casas de campaña opcionales",
      ],
      en: ["Swings and playhouse", "Green areas", "Optional tents"],
    },
    photos: [
      {
        file: "patio/casita-juegos.jpg",
        alt: {
          es: "Casita de juegos de madera roja y blanca entre palmas",
          en: "Red and white wooden playhouse among palms",
        },
      },
      {
        file: "patio/patio-03.jpg",
        alt: {
          es: "Columpios en el patio entre árboles",
          en: "Swings in the yard among trees",
        },
      },
      {
        file: "patio/patio-04.jpg",
        alt: {
          es: "Jardín con palmas y césped",
          en: "Garden with palms and lawn",
        },
      },
      {
        file: "patio/patio-02.jpg",
        alt: {
          es: "Camino de grava bajo un flamboyán en el patio",
          en: "Gravel path under a flame tree in the yard",
        },
      },
      {
        file: "patio/banco-gomas.jpg",
        alt: {
          es: "Banco hecho con gomas pintadas de azul, blanco y rojo",
          en: "Bench made from tyres painted blue, white and red",
        },
      },
      {
        file: "patio/patio-05.jpg",
        alt: {
          es: "Palma de coco en el patio",
          en: "Coconut palm in the yard",
        },
      },
      {
        file: "patio/patio-06.jpg",
        alt: { es: "Racimo de cocos verdes", en: "Bunch of green coconuts" },
      },
      {
        file: "patio/patio-07.jpg",
        alt: {
          es: "Mangos colgando de una mata del patio",
          en: "Mangoes hanging from a tree in the yard",
        },
      },
      {
        file: "patio/patio-10.jpg",
        alt: {
          es: "Gallinas sueltas en el patio",
          en: "Free-roaming chickens in the yard",
        },
      },
    ],
  },
];

/** Imagen para compartir en redes: la vista panorámica. */
export const HERO_PHOTO = "vista/vista-02.jpg";

export type AmenityIcon =
  | "bed"
  | "pool"
  | "billiards"
  | "domino"
  | "fire"
  | "kitchen"
  | "tree"
  | "swing"
  | "snow"
  | "bolt"
  | "car"
  | "tent";

export interface Amenity {
  icon: AmenityIcon;
  text: Localized;
}

export const AMENITIES: Amenity[] = [
  {
    icon: "bed",
    text: {
      es: "7 habitaciones: 5 para parejas y 2 familiares",
      en: "7 rooms: 5 for couples and 2 for families",
    },
  },
  {
    icon: "pool",
    text: {
      es: "Piscina amplia con baño propio",
      en: "Large pool with its own bathroom",
    },
  },
  { icon: "billiards", text: { es: "Mesa de billar", en: "Pool table" } },
  { icon: "domino", text: { es: "Mesa de dominó", en: "Dominoes table" } },
  {
    icon: "fire",
    text: { es: "Área de BBQ y asadero", en: "BBQ and grill area" },
  },
  { icon: "kitchen", text: { es: "Cocina equipada", en: "Equipped kitchen" } },
  { icon: "tree", text: { es: "Áreas verdes", en: "Green areas" } },
  {
    icon: "swing",
    text: {
      es: "Columpios y casita de juegos para niños",
      en: "Swings and a playhouse for kids",
    },
  },
  {
    icon: "snow",
    text: {
      es: "Aire acondicionado en las habitaciones",
      en: "Air conditioning in the rooms",
    },
  },
  {
    icon: "bolt",
    text: { es: "Luz las 24 horas", en: "Power 24 hours a day" },
  },
  { icon: "car", text: { es: "Parqueo privado", en: "Private parking" } },
  {
    icon: "tent",
    text: {
      es: "2 casas de campaña (costo adicional)",
      en: "2 tents (extra charge)",
    },
  },
];

/** Fotos del pase de la portada (horizontales), en orden. La primera se carga con prioridad. */
export const HERO_SLIDES = [
  "vista/vista-02.jpg",
  "piscina/piscina-01.jpg",
  "casa/casa-01.jpg",
  "llegada/llegada-01.jpg",
  "vista/vista-01.jpg",
];

/** Tarifas publicadas por el rancho (RD$). */

export interface Rate {
  kind: VisitKind;
  name: Localized;
  price: number;
  unit: Localized;
  details: Record<Lang, string[]>;
}

export const RATES: Rate[] = [
  {
    kind: "pasadia",
    name: { es: "Pasadía", en: "Day pass" },
    price: 10000,
    unit: { es: "por grupo", en: "per group" },
    details: {
      es: [
        "Grupos de 30 a 45 personas",
        "De 9:30 a. m. a 6:00 p. m.",
        "Piscina, billar, dominó y BBQ",
      ],
      en: [
        "Groups of 30 to 45 people",
        "9:30 a.m. to 6:00 p.m.",
        "Pool, pool table, dominoes and BBQ",
      ],
    },
  },
  {
    kind: "estadia",
    name: { es: "Estadía", en: "Overnight stay" },
    price: 16000,
    unit: { es: "por noche", en: "per night" },
    details: {
      es: [
        "Alojamiento para hasta 18 personas",
        "7 habitaciones con aire acondicionado",
        "Salida a las 6:00 p. m. del día siguiente",
      ],
      en: [
        "Sleeps up to 18 people",
        "7 air-conditioned rooms",
        "Check-out at 6:00 p.m. the next day",
      ],
    },
  },
];

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
  {
    name: { es: "Playas de Uvero Alto", en: "Uvero Alto beaches" },
    km: 20,
    minutes: 15,
  },
  {
    name: { es: "Higüey y su Basílica", en: "Higüey and its Basilica" },
    km: 35,
    minutes: 30,
  },
  { name: { es: "Playa Macao", en: "Macao beach" }, km: 35, minutes: 35 },
  {
    name: { es: "Miches y Playa Esmeralda", en: "Miches and Esmeralda beach" },
    km: 45,
    minutes: 40,
  },
  { name: { es: "Bávaro", en: "Bávaro" }, km: 50, minutes: 45 },
  {
    name: { es: "Aeropuerto de Punta Cana", en: "Punta Cana Airport" },
    km: 60,
    minutes: 60,
  },
];
