import { ROUTE_PATHS } from '../app/routes';
import type {
  BiaMetric,
  CoffeeBrandId,
  ContentStatus,
  LocalizedCopy,
} from '../types';

const copy = (es: string, en: string): LocalizedCopy => ({ es, en });

export type SecondaryPageId =
  | 'nosotros'
  | 'marcas'
  | 'calidad'
  | 'talento'
  | 'contactanos';

export const SECONDARY_PAGE_IDS = [
  'nosotros',
  'marcas',
  'calidad',
  'talento',
  'contactanos',
] as const satisfies readonly SecondaryPageId[];

export interface SecondaryPageDefinition {
  id: SecondaryPageId;
  /** Canonical Spanish destination. */
  canonicalPath: string;
  /** English alias that resolves to the same route id. */
  aliasPath: string;
  eyebrow: LocalizedCopy;
  title: LocalizedCopy;
  description: LocalizedCopy;
  documentTitle: LocalizedCopy;
  documentDescription: LocalizedCopy;
  /**
   * Status of the framing copy only. Anything that still depends on facts BIA
   * has not supplied lives in the entries below with its own `placeholder`
   * status and an explicit pending note.
   */
  status: ContentStatus;
}

/**
 * Single source of truth for the framing copy and document metadata of every
 * secondary page. No metric, certification, address, date, or opening is
 * stated as fact here: pending facts live in the entries below as
 * `placeholder` with a pending note.
 */
export const secondaryPages: Readonly<
  Record<SecondaryPageId, SecondaryPageDefinition>
> = {
  nosotros: {
    id: 'nosotros',
    canonicalPath: ROUTE_PATHS.nosotros,
    aliasPath: '/about',
    eyebrow: copy('Nosotros', 'About us'),
    title: copy(
      'Una historia que empieza en la tierra.',
      'A story that begins in the land.',
    ),
    description: copy(
      'BIA Honduras es el pilar hondureño de BIA Foods. Conoce el origen que nos sostiene, las marcas que llevamos y las personas detrás de cada historia.',
      'BIA Honduras is the Honduran pillar of BIA Foods. Discover the origin that holds us, the brands we carry, and the people behind every story.',
    ),
    documentTitle: copy(
      'Nosotros | BIA Honduras',
      'About us | BIA Honduras',
    ),
    documentDescription: copy(
      'Conoce BIA Honduras, el pilar hondureño de BIA Foods: nuestra historia, el origen del café y las personas detrás de cada marca.',
      'Discover BIA Honduras, the Honduran pillar of BIA Foods: our history, coffee origin, and the people behind every brand.',
    ),
    status: 'approved',
  },
  marcas: {
    id: 'marcas',
    canonicalPath: ROUTE_PATHS.marcas,
    aliasPath: '/brands',
    eyebrow: copy('Nuestras marcas', 'Our brands'),
    title: copy('Cuatro marcas, una familia BIA.', 'Four brands, one BIA family.'),
    description: copy(
      'Café El Indio, Café Maya, Oro Puro y Medalla forman parte de nuestra identidad. Los detalles de cada producto se confirmarán con BIA.',
      'Café El Indio, Café Maya, Oro Puro, and Medalla are part of our identity. The details of each product will be confirmed with BIA.',
    ),
    documentTitle: copy('Marcas | BIA Honduras', 'Brands | BIA Honduras'),
    documentDescription: copy(
      'Conoce las marcas de café de BIA Honduras: El Indio, Café Maya, Oro Puro y Medalla.',
      'Discover the coffee brands of BIA Honduras: El Indio, Café Maya, Oro Puro, and Medalla.',
    ),
    status: 'approved',
  },
  calidad: {
    id: 'calidad',
    canonicalPath: ROUTE_PATHS.calidad,
    aliasPath: '/quality',
    eyebrow: copy('Calidad y sostenibilidad', 'Quality and sustainability'),
    title: copy('Cuidar para seguir creciendo.', 'Carefully growing with purpose.'),
    description: copy(
      'Origen, seguridad alimentaria, trazabilidad, productores locales, estándares y cultura: las prioridades que guían nuestro trabajo.',
      'Origin, food safety, traceability, local producers, standards, and culture: the priorities that guide our work.',
    ),
    documentTitle: copy(
      'Calidad y sostenibilidad | BIA Honduras',
      'Quality & sustainability | BIA Honduras',
    ),
    documentDescription: copy(
      'Conoce el origen, la seguridad alimentaria, la trazabilidad y el trabajo con productores locales en BIA Honduras.',
      'Discover origin, food safety, traceability, and the work with local producers at BIA Honduras.',
    ),
    status: 'approved',
  },
  talento: {
    id: 'talento',
    canonicalPath: ROUTE_PATHS.talento,
    aliasPath: '/careers',
    eyebrow: copy('Personas BIA', 'BIA people'),
    title: copy(
      'El próximo capítulo también puede ser tuyo.',
      'The next chapter could be yours.',
    ),
    description: copy(
      'Conoce las áreas de talento, nuestra forma de trabajar y el proceso para compartir tu historia con nosotros.',
      'Discover the talent areas, how we work, and the process for sharing your story with us.',
    ),
    documentTitle: copy('Talento | BIA Honduras', 'Talent | BIA Honduras'),
    documentDescription: copy(
      'Descubre las áreas de talento en BIA Honduras, nuestra forma de trabajar y el proceso para compartir tu historia.',
      'Discover the talent areas at BIA Honduras, how we work, and the process for sharing your story.',
    ),
    status: 'approved',
  },
  contactanos: {
    id: 'contactanos',
    canonicalPath: ROUTE_PATHS.contactanos,
    aliasPath: '/contact',
    eyebrow: copy('Contáctanos', 'Contact us'),
    title: copy('Una conversación empieza aquí.', 'A conversation starts here.'),
    description: copy(
      'Encuentra la audiencia adecuada para tu consulta. Los datos de contacto se publicarán cuando BIA los confirme.',
      'Find the right audience for your inquiry. Contact details will be published once BIA confirms them.',
    ),
    documentTitle: copy(
      'Contáctanos | BIA Honduras',
      'Contact us | BIA Honduras',
    ),
    documentDescription: copy(
      'Encuentra cómo llegar al equipo de BIA Honduras según tu consulta.',
      'Find how to reach the BIA Honduras team for your inquiry.',
    ),
    status: 'approved',
  },
};

export function isSecondaryPageId(value: unknown): value is SecondaryPageId {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(secondaryPages, value)
  );
}

export function getSecondaryPage(id: SecondaryPageId): SecondaryPageDefinition {
  return secondaryPages[id];
}

export interface SecondaryIdentityNote {
  id: string;
  title: LocalizedCopy;
  description: LocalizedCopy;
  pending: LocalizedCopy;
  status: ContentStatus;
}

/**
 * Framing notes for the identity section. They restate the narrative the Home
 * already carries; anything more specific stays a pending note.
 */
export const secondaryIdentityNotes: readonly SecondaryIdentityNote[] = [
  {
    id: 'origen',
    title: copy('Origen', 'Origin'),
    description: copy(
      'Copán, Marcala y Montecillos son el punto de partida del trabajo de BIA.',
      'Copán, Marcala, and Montecillos are the starting point of BIA’s work.',
    ),
    pending: copy(
      'El detalle de la relación con cada origen se confirmará con BIA.',
      'The detail of the relationship with each origin will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'proceso',
    title: copy('Proceso', 'Process'),
    description: copy(
      'Del cultivo a la mesa, el proceso acompaña a cada producto.',
      'From crop to table, the process accompanies every product.',
    ),
    pending: copy(
      'El detalle técnico del proceso se confirmará con BIA.',
      'The technical detail of the process will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'personas',
    title: copy('Personas', 'People'),
    description: copy(
      'Productores, equipos y clientes comparten la misma tierra y el mismo propósito.',
      'Producers, teams, and customers share the same land and the same purpose.',
    ),
    pending: copy(
      'Las historias y cifras de personas se confirmarán con BIA.',
      'The people stories and figures will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
];

export interface SecondarySectionCopy {
  /** Stable anchor id so cross-page links and the header offset stay correct. */
  id: string;
  eyebrow: LocalizedCopy;
  title: LocalizedCopy;
  description: LocalizedCopy | null;
}

/**
 * Section-level copy for the corporate subpages. It lives next to the page
 * framing copy so a page never hard-codes a string that must exist in two
 * locales.
 */
export const secondarySectionCopy: Readonly<
  Record<SecondaryPageId, readonly SecondarySectionCopy[]>
> = {
  nosotros: [
    {
      id: 'bia-nosotros-identidad',
      eyebrow: copy('Quiénes somos', 'Who we are'),
      title: copy('El pilar hondureño de BIA Foods.', 'The Honduran pillar of BIA Foods.'),
      description: copy(
        'BIA Honduras nace del café y sostiene su trabajo en el origen, el proceso y las personas.',
        'BIA Honduras grows out of coffee and sustains its work across origin, process, and people.',
      ),
    },
    {
      id: 'bia-nosotros-historia',
      eyebrow: copy('Nuestra historia', 'Our history'),
      title: copy('Una historia que todavía se escribe.', 'A story still being written.'),
      description: copy(
        'Estos son los momentos que BIA ha identificado. Las fechas se publicarán cuando la compañía las confirme.',
        'These are the moments BIA has identified. Dates will be published once the company confirms them.',
      ),
    },
    {
      id: 'bia-nosotros-valores',
      eyebrow: copy('Nuestros valores', 'Our values'),
      title: copy('Lo que sostiene cada decisión.', 'What holds every decision together.'),
      description: copy(
        'Origen, calidad, personas y sostenibilidad son las ideas con las que BIA trabaja.',
        'Origin, quality, people, and sustainability are the ideas BIA works with.',
      ),
    },
  ],
  marcas: [
    {
      id: 'bia-marcas-familia',
      eyebrow: copy('La familia BIA', 'The BIA family'),
      title: copy('Cuatro marcas, una misma raíz.', 'Four brands, one shared root.'),
      description: copy(
        'El café es el punto de partida compartido por todas nuestras marcas.',
        'Coffee is the shared starting point behind every one of our brands.',
      ),
    },
    {
      id: 'bia-marcas-portafolio',
      eyebrow: copy('Nuestras marcas', 'Our brands'),
      title: copy('Conoce cada nombre.', 'Meet every name.'),
      description: copy(
        'La información de producto de cada marca se publicará cuando BIA la confirme.',
        'Product information for each brand will be published once BIA confirms it.',
      ),
    },
  ],
  calidad: [
    {
      id: 'bia-calidad-pilares',
      eyebrow: copy('Cómo trabajamos', 'How we work'),
      title: copy('Calidad que se puede recorrer.', 'Quality you can follow.'),
      description: copy(
        'Origen, seguridad alimentaria, productores, trazabilidad, estándares y cultura: las prioridades que guían nuestro trabajo.',
        'Origin, food safety, producers, traceability, standards, and culture: the priorities that guide our work.',
      ),
    },
    {
      id: 'bia-calidad-territorio',
      eyebrow: copy('El territorio', 'The territory'),
      title: copy('Copán, Marcala, Montecillos.', 'Copán, Marcala, Montecillos.'),
      description: copy(
        'Tres orígenes hondureños que dan sentido a cada decisión de BIA.',
        'Three Honduran origins that give meaning to every BIA decision.',
      ),
    },
  ],
  talento: [
    {
      id: 'bia-talento-areas',
      eyebrow: copy('Áreas de talento', 'Talent areas'),
      title: copy('Dónde puedes crecer.', 'Where you can grow.'),
      description: copy(
        'Conoce las áreas donde BIA trabaja y cómo se organiza el equipo.',
        'Discover the areas where BIA works and how the team is organized.',
      ),
    },
  ],
  contactanos: [
    {
      id: 'bia-contact-audiencias',
      eyebrow: copy('Elige tu camino', 'Choose your path'),
      title: copy('¿Sobre qué nos escribes?', 'What are you writing about?'),
      description: copy(
        'Cada consulta tiene una ruta clara dentro de BIA.',
        'Every inquiry has a clear route inside BIA.',
      ),
    },
  ],
};

export function getSecondarySectionCopy(id: SecondaryPageId): readonly SecondarySectionCopy[] {
  return secondarySectionCopy[id];
}

export interface SecondaryBrandEntry {
  id: CoffeeBrandId;
  name: LocalizedCopy;
  category: LocalizedCopy;
  description: LocalizedCopy;
  /** What BIA still has to supply before product copy can be published. */
  pending: LocalizedCopy;
  status: ContentStatus;
}

export const SECONDARY_BRAND_ENTRIES: readonly SecondaryBrandEntry[] = [
  {
    id: 'el-indio',
    name: copy('Café El Indio', 'Café El Indio'),
    category: copy('Café', 'Coffee'),
    description: copy(
      'Café El Indio es una marca de café de la familia BIA Honduras.',
      'Café El Indio is a coffee brand from the BIA Honduras family.',
    ),
    pending: copy(
      'El origen, la presentación y las notas de cata se confirmarán con BIA.',
      'Origin, packaging, and tasting notes will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'cafe-maya',
    name: copy('Café Maya', 'Café Maya'),
    category: copy('Café', 'Coffee'),
    description: copy(
      'Café Maya es una marca de café de la familia BIA Honduras.',
      'Café Maya is a coffee brand from the BIA Honduras family.',
    ),
    pending: copy(
      'El origen, la presentación y el perfil de producto se confirmarán con BIA.',
      'Origin, packaging, and product profile will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'oro-puro',
    name: copy('Oro Puro', 'Oro Puro'),
    category: copy('Café', 'Coffee'),
    description: copy(
      'Oro Puro es una marca de café de la familia BIA Honduras.',
      'Oro Puro is a coffee brand from the BIA Honduras family.',
    ),
    pending: copy(
      'El origen, la presentación y los datos de producto se confirmarán con BIA.',
      'Origin, packaging, and product details will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'medalla',
    name: copy('Medalla', 'Medalla'),
    category: copy('Café', 'Coffee'),
    description: copy(
      'Medalla es una marca de café de la familia BIA Honduras.',
      'Medalla is a coffee brand from the BIA Honduras family.',
    ),
    pending: copy(
      'El origen, la presentación y los datos de producto se confirmarán con BIA.',
      'Origin, packaging, and product details will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
];

export type QualityPillarId =
  | 'origin'
  | 'food-safety'
  | 'local-producers'
  | 'traceability'
  | 'standards'
  | 'culture';

export interface QualityPillar {
  id: QualityPillarId;
  title: LocalizedCopy;
  description: LocalizedCopy;
  status: ContentStatus;
  pending: LocalizedCopy | null;
}

export const qualityPillars: readonly QualityPillar[] = [
  {
    id: 'origin',
    title: copy('Origen', 'Origin'),
    description: copy(
      'Copán, Marcala y Montecillos sitúan el origen que da sentido a cada decisión de BIA.',
      'Copán, Marcala, and Montecillos situate the origin that gives meaning to every BIA decision.',
    ),
    status: 'approved',
    pending: null,
  },
  {
    id: 'food-safety',
    title: copy('Seguridad alimentaria', 'Food safety'),
    description: copy(
      'La calidad y la seguridad alimentaria consideran el recorrido completo de BIA Foods, del origen a la mesa.',
      'Quality and food safety consider the complete BIA Foods journey, from origin to table.',
    ),
    status: 'approved',
    pending: null,
  },
  {
    id: 'local-producers',
    title: copy('Productores locales', 'Local producers'),
    description: copy(
      'Reconocer el valor de los productores locales mantiene presente a las personas detrás de cada origen.',
      'Recognizing the value of local producers keeps the people behind each origin present.',
    ),
    status: 'approved',
    pending: null,
  },
  {
    id: 'traceability',
    title: copy('Trazabilidad', 'Traceability'),
    description: copy(
      'La trazabilidad conecta cada paso del café con las personas y los lugares que lo hacen posible.',
      'Traceability connects every coffee step with the people and places that make it possible.',
    ),
    status: 'placeholder',
    pending: copy(
      'El detalle de los sistemas de trazabilidad se confirmará con BIA.',
      'The detail of the traceability systems will be confirmed with BIA.',
    ),
  },
  {
    id: 'standards',
    title: copy('Estándares', 'Standards'),
    description: copy(
      'La calidad se apoya en estándares de trabajo que se confirmarán con BIA antes de publicarse.',
      'Quality rests on working standards that will be confirmed with BIA before publication.',
    ),
    status: 'placeholder',
    pending: copy(
      'Los estándares concretos que aplican a BIA se confirmarán con BIA.',
      'The specific standards that apply to BIA will be confirmed with BIA.',
    ),
  },
  {
    id: 'culture',
    title: copy('Cultura', 'Culture'),
    description: copy(
      'Conversar sobre la cultura y la experiencia de las personas en BIA es parte de nuestro trabajo.',
      'Talking about culture and the experience of people at BIA is part of our work.',
    ),
    status: 'placeholder',
    pending: copy(
      'BIA confirmará los detalles de la experiencia de las personas.',
      'BIA will confirm the details of the people experience.',
    ),
  },
];

export const HISTORY_PERIOD_PENDING: LocalizedCopy = copy(
  'Fecha por confirmar con BIA',
  'Date to be confirmed with BIA',
);

export interface HistoryMoment {
  id: string;
  /** `null` until BIA confirms a date or era. */
  period: string | null;
  title: LocalizedCopy;
  description: LocalizedCopy;
  pending: LocalizedCopy;
  status: ContentStatus;
}

export const historyMoments: readonly HistoryMoment[] = [
  {
    id: 'origen-hondureno',
    period: null,
    title: copy('El origen hondureño', 'The Honduran origin'),
    description: copy(
      'BIA Honduras es el pilar hondureño de BIA Foods, una empresa de alimentos con raíces en el café.',
      'BIA Honduras is the Honduran pillar of BIA Foods, a food company rooted in coffee.',
    ),
    pending: copy(
      'La fecha de este momento se confirmará con BIA.',
      'The date of this moment will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'cafe-como-raiz',
    period: null,
    title: copy('El café como raíz', 'Coffee as a root'),
    description: copy(
      'El origen, el proceso y la calidad sostienen la historia de BIA en Honduras.',
      'Origin, process, and quality sustain the BIA story in Honduras.',
    ),
    pending: copy(
      'La fecha de este momento se confirmará con BIA.',
      'The date of this moment will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'familia-de-marcas',
    period: null,
    title: copy('La familia de marcas', 'The brand family'),
    description: copy(
      'Café El Indio, Café Maya, Oro Puro y Medalla definen la identidad de BIA Honduras.',
      'Café El Indio, Café Maya, Oro Puro, and Medalla define the identity of BIA Honduras.',
    ),
    pending: copy(
      'La fecha de este momento se confirmará con BIA.',
      'The date of this moment will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'personas',
    period: null,
    title: copy('Las personas', 'The people'),
    description: copy(
      'Productores, equipos y clientes comparten la misma tierra y el mismo propósito.',
      'Producers, teams, and customers share the same land and the same purpose.',
    ),
    pending: copy(
      'La fecha de este momento se confirmará con BIA.',
      'The date of this moment will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
];

export interface SecondaryValue {
  id: string;
  title: LocalizedCopy;
  description: LocalizedCopy;
  pending: LocalizedCopy;
  status: ContentStatus;
}

export const secondaryValues: readonly SecondaryValue[] = [
  {
    id: 'origen',
    title: copy('Origen', 'Origin'),
    description: copy(
      'El origen hondureño marca el punto de partida de cada decisión.',
      'The Honduran origin is the starting point for every decision.',
    ),
    pending: copy(
      'La formulación final de este valor se confirmará con BIA.',
      'The final wording of this value will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'calidad',
    title: copy('Calidad', 'Quality'),
    description: copy(
      'La calidad acompaña el recorrido completo, del cultivo a la mesa.',
      'Quality accompanies the complete journey, from crop to table.',
    ),
    pending: copy(
      'La formulación final de este valor se confirmará con BIA.',
      'The final wording of this value will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'personas',
    title: copy('Personas', 'People'),
    description: copy(
      'Las personas detrás del café son el centro de la historia de BIA.',
      'The people behind the coffee are at the center of the BIA story.',
    ),
    pending: copy(
      'La formulación final de este valor se confirmará con BIA.',
      'The final wording of this value will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'sostenibilidad',
    title: copy('Sostenibilidad', 'Sustainability'),
    description: copy(
      'La sostenibilidad se trabaja junto a los productores locales y el suelo que sostiene el cultivo.',
      'Sustainability is worked on alongside local producers and the soil that sustains the crop.',
    ),
    pending: copy(
      'Los programas de sostenibilidad se confirmarán con BIA.',
      'The sustainability programs will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
];

export const CONTACT_DETAILS_PENDING: LocalizedCopy = copy(
  'Los datos de contacto se publicarán cuando BIA los confirme.',
  'Contact details will be published once BIA confirms them.',
);

export type ContactAudienceId = 'general' | 'partners' | 'press' | 'talent';

export interface ContactAudience {
  id: ContactAudienceId;
  title: LocalizedCopy;
  description: LocalizedCopy;
  /** Internal destination only: a route path, optionally with an anchor. */
  destination: string;
  pending: LocalizedCopy;
  status: ContentStatus;
}

export const contactAudiences: readonly ContactAudience[] = [
  {
    id: 'general',
    title: copy('Consultas generales', 'General inquiries'),
    description: copy(
      'Temas de BIA Honduras que no corresponden a otra audiencia.',
      'BIA Honduras matters that do not belong to another audience.',
    ),
    destination: `${ROUTE_PATHS.contactanos}#bia-contact-channels`,
    pending: copy(
      'El canal de contacto general se confirmará con BIA.',
      'The general contact channel will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'partners',
    title: copy('Partners y marcas', 'Partners and brands'),
    description: copy(
      'Negocios, partners y proyectos que trabajan con BIA Foods y sus marcas.',
      'Businesses, partners, and projects working with BIA Foods and its brands.',
    ),
    destination: `${ROUTE_PATHS.contactanos}#bia-contact-channels`,
    pending: copy(
      'El canal para partners y marcas se confirmará con BIA.',
      'The channel for partners and brands will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'press',
    title: copy('Prensa y medios', 'Press and media'),
    description: copy(
      'Solicitudes de información para prensa y medios.',
      'Information requests from press and media.',
    ),
    destination: `${ROUTE_PATHS.contactanos}#bia-contact-channels`,
    pending: copy(
      'El contacto de prensa se confirmará con BIA.',
      'The press contact will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'talent',
    title: copy('Talento', 'Talent'),
    description: copy(
      'Candidaturas y consultas sobre oportunidades en BIA Honduras.',
      'Applications and inquiries about opportunities at BIA Honduras.',
    ),
    destination: ROUTE_PATHS.talento,
    pending: copy(
      'El seguimiento de las candidaturas se confirmará con BIA.',
      'The follow-up for applications will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
];

export interface ContactChannel {
  id: string;
  label: LocalizedCopy;
  /** Always `null` until BIA supplies an approved value. */
  value: string | null;
  pending: LocalizedCopy | null;
  status: ContentStatus;
}

export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'email-general',
    label: copy('Correo electrónico general', 'General email'),
    value: null,
    pending: CONTACT_DETAILS_PENDING,
    status: 'placeholder',
  },
  {
    id: 'phone-general',
    label: copy('Teléfono general', 'General phone'),
    value: null,
    pending: CONTACT_DETAILS_PENDING,
    status: 'placeholder',
  },
  {
    id: 'address-honduras',
    label: copy('Dirección en Honduras', 'Address in Honduras'),
    value: null,
    pending: CONTACT_DETAILS_PENDING,
    status: 'placeholder',
  },
];

export type TalentAreaId =
  | 'coffee-origin'
  | 'production-quality'
  | 'culinary-product'
  | 'partners-service';

export interface TalentArea {
  id: TalentAreaId;
  title: LocalizedCopy;
  description: LocalizedCopy;
  pending: LocalizedCopy;
  status: ContentStatus;
}

export const talentAreas: readonly TalentArea[] = [
  {
    id: 'coffee-origin',
    title: copy('Café y origen', 'Coffee and origin'),
    description: copy(
      'Equipos que trabajan con el café, el origen y la relación con los productores.',
      'Teams working with coffee, origin, and the relationship with producers.',
    ),
    pending: copy(
      'Las vacantes de esta área se confirmarán con BIA.',
      'Open roles in this area will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'production-quality',
    title: copy('Producción y calidad', 'Production and quality'),
    description: copy(
      'Equipos que sostienen el proceso, la operación diaria y la calidad del producto.',
      'Teams that sustain the process, daily operation, and product quality.',
    ),
    pending: copy(
      'Las vacantes de esta área se confirmarán con BIA.',
      'Open roles in this area will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'culinary-product',
    title: copy('Culinary y producto', 'Culinary and product'),
    description: copy(
      'Equipos de culinary y de desarrollo de producto dentro de BIA Foods.',
      'Culinary and product development teams within BIA Foods.',
    ),
    pending: copy(
      'Las vacantes de esta área se confirmarán con BIA.',
      'Open roles in this area will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
  {
    id: 'partners-service',
    title: copy('Partners y servicio', 'Partners and service'),
    description: copy(
      'Equipos que trabajan con partners y servicios de alimentación.',
      'Teams working with partners and food service.',
    ),
    pending: copy(
      'Las vacantes de esta área se confirmarán con BIA.',
      'Open roles in this area will be confirmed with BIA.',
    ),
    status: 'placeholder',
  },
];

export interface TalentOpenings {
  headline: LocalizedCopy;
  note: LocalizedCopy;
  /** `null` until BIA supplies an approved openings list. */
  count: number | null;
  status: ContentStatus;
}

export const talentOpenings: TalentOpenings = {
  headline: copy(
    'No estamos aceptando solicitudes por el momento.',
    'We are not accepting applications at this time.',
  ),
  note: copy(
    'Las oportunidades se publicarán aquí cuando estén disponibles.',
    'Opportunities will be published here when they are available.',
  ),
  count: null,
  status: 'placeholder',
};

/**
 * Kept empty on purpose. Add an entry only when BIA supplies an approved value
 * for a secondary page, so metrics never leak into the narrative copy.
 */
export const secondaryPageMetrics: readonly BiaMetric[] = [];
