import type {
  BiaContent,
  BiaHub,
  CoffeeBrand,
  ContentStatus,
  LocalizedCopy,
  OriginRegion,
  ProcessStep,
  ValueProposition,
} from '../types';

const copy = (es: string, en: string): LocalizedCopy => ({ es, en });

const hub = (
  id: BiaHub['id'],
  name: string,
  description: LocalizedCopy,
  status: ContentStatus,
): BiaHub => ({ id, name: copy(name, name), description, status });

const brand = (
  id: CoffeeBrand['id'],
  name: string,
  description: LocalizedCopy,
  status: ContentStatus,
): CoffeeBrand => ({
  id,
  name: copy(name, name),
  description,
  status,
});

const region = (
  id: OriginRegion['id'],
  name: string,
  description: LocalizedCopy,
  status: ContentStatus,
): OriginRegion => ({
  id,
  name: copy(name, name),
  description,
  status,
});

const valueProposition = (
  id: string,
  titleEs: string,
  titleEn: string,
  description: LocalizedCopy,
  status: ContentStatus,
): ValueProposition => ({
  id,
  title: copy(titleEs, titleEn),
  description,
  status,
});

const processStep = (
  id: string,
  titleEs: string,
  titleEn: string,
  description: LocalizedCopy,
  status: ContentStatus = 'placeholder',
): ProcessStep => ({
  id,
  title: copy(titleEs, titleEn),
  description,
  status,
});

export const biaContent: BiaContent = {
  organization: {
    name: 'BIA Honduras',
    parent: 'BIA Foods',
    description: copy(
      'BIA Honduras es el pilar hondureño de BIA Foods, una empresa de alimentos con raíces en el café.',
      'BIA Honduras is the Honduran pillar of BIA Foods, a food company rooted in coffee.',
    ),
    status: 'approved',
  },
  narrative: [
    {
      id: 'from-honduras-with-purpose',
      copy: copy(
        'De Honduras, con propósito.',
        'From Honduras, with purpose.',
      ),
      status: 'approved',
    },
  ],
  hubs: [
    hub(
      'coffee',
      'Coffee Hub',
      copy(
        'El café conecta el origen, la calidad y las marcas de BIA.',
        'Coffee connects origin, quality, and the BIA brands.',
      ),
      'approved',
    ),
    hub(
      'culinary',
      'Culinary Hub',
      copy(
        'Un hub para llevar la experiencia de BIA Foods a la mesa.',
        'A hub for bringing the BIA Foods experience to the table.',
      ),
      'placeholder',
    ),
    hub(
      'snacks',
      'Snacks Hub',
      copy(
        'Sabores y momentos que acompañan la vida diaria.',
        'Flavors and moments that accompany everyday life.',
      ),
      'placeholder',
    ),
    hub(
      'partners-food-service',
      'Partners & Food Service',
      copy(
        'Una plataforma para trabajar junto a partners y servicios de alimentación.',
        'A platform for working alongside partners and food-service communities.',
      ),
      'placeholder',
    ),
  ],
  brands: [
    brand(
      'el-indio',
      'Café El Indio',
      copy(
        'Una marca de café de la familia BIA.',
        'A coffee brand from the BIA family.',
      ),
      'placeholder',
    ),
    brand(
      'cafe-maya',
      'Café Maya',
      copy(
        'Una marca de café de la familia BIA.',
        'A coffee brand from the BIA family.',
      ),
      'placeholder',
    ),
    brand(
      'oro-puro',
      'Oro Puro',
      copy(
        'Una marca de café de la familia BIA.',
        'A coffee brand from the BIA family.',
      ),
      'placeholder',
    ),
    brand(
      'medalla',
      'Medalla',
      copy(
        'Una marca de café de la familia BIA.',
        'A coffee brand from the BIA family.',
      ),
      'placeholder',
    ),
  ],
  originRegions: [
    region(
      'copan',
      'Copán',
      copy(
        'Un territorio de Honduras donde la historia del café se conecta con su paisaje.',
        'A Honduran territory where coffee history connects with the landscape.',
      ),
      'placeholder',
    ),
    region(
      'marcala',
      'Marcala',
      copy(
        'Un origen de café que forma parte del paisaje hondureño.',
        'A coffee origin that is part of the Honduran landscape.',
      ),
      'placeholder',
    ),
    region(
      'montecillos',
      'Montecillos',
      copy(
        'Un nombre que sitúa la historia del café dentro de las regiones de Honduras.',
        'A name that places coffee history within the regions of Honduras.',
      ),
      'placeholder',
    ),
  ],
  valuePropositions: [
    valueProposition(
      'local-producer-value-chain',
      'Cadena de valor de productores locales',
      'Local producer value chain',
      copy(
        'La historia de BIA reconoce el valor de los productores locales y mantiene visible su papel en la cadena.',
        'BIA’s story recognizes the value of local producers and keeps their role in the chain visible.',
      ),
      'placeholder',
    ),
    valueProposition(
      'food-safety-standards',
      'Estándares internacionales de seguridad alimentaria',
      'International food-safety standards',
      copy(
        'La calidad y la seguridad alimentaria son parte del recorrido de BIA Foods, desde el café hasta la mesa.',
        'Quality and food safety are part of the BIA Foods journey, from coffee to the table.',
      ),
      'placeholder',
    ),
    valueProposition(
      'great-place-to-work-culture',
      'Cultura Great Place to Work',
      'Great Place to Work culture',
      copy(
        'Great Place to Work es una referencia para conversar de la cultura y la experiencia de las personas en BIA.',
        'Great Place to Work is a reference for discussing the culture and experience of people at BIA.',
      ),
      'placeholder',
    ),
  ],
  processSteps: [
    processStep(
      'seed',
      'Semilla',
      'Seed',
      copy(
        'Todo comienza con la semilla y el cuidado del cultivo.',
        'Everything begins with the seed and the care of the crop.',
      ),
    ),
    processStep(
      'harvest',
      'Cosecha',
      'Harvest',
      copy(
        'La cosecha conecta el trabajo de la tierra con el siguiente paso.',
        'Harvest connects the work of the land with the next step.',
      ),
    ),
    processStep(
      'processing',
      'Procesamiento',
      'Processing',
      copy(
        'El procesamiento da forma al café que llega a cada etapa posterior.',
        'Processing shapes the coffee that moves through each later stage.',
      ),
    ),
    processStep(
      'roasting',
      'Tostado',
      'Roasting',
      copy(
        'El tostado prepara el café para su próximo uso.',
        'Roasting prepares the coffee for its next use.',
      ),
    ),
    processStep(
      'grinding',
      'Molienda',
      'Grinding',
      copy(
        'La molienda acompaña el momento en que el café se consume.',
        'Grinding accompanies the moment the coffee is enjoyed.',
      ),
    ),
    processStep(
      'quality',
      'Calidad',
      'Quality',
      copy(
        'La calidad acompaña cada decisión del proceso.',
        'Quality accompanies every decision in the process.',
      ),
    ),
    processStep(
      'distribution',
      'Distribución',
      'Distribution',
      copy(
        'La distribución lleva el producto BIA a más manos y mesas.',
        'Distribution brings BIA products to more hands and tables.',
      ),
    ),
  ],
  media: [
    {
      id: 'origin-hero-film',
      kind: 'video',
      src: '/media/bia-origin-hero.mp4',
      decorative: true,
      status: 'approved',
    },
    {
      id: 'origin-hero-poster',
      kind: 'poster',
      src: '/media/bia-origin-poster.jpg',
      decorative: true,
      status: 'approved',
    },
    {
      // Normalized web derivative of src/assets/17190655-uhd_3840_2160_24fps.mp4.
      id: 'motion-story-film',
      kind: 'video',
      src: '/media/bia-motion-story.mp4',
      decorative: true,
      status: 'approved',
    },
    {
      id: 'motion-story-poster',
      kind: 'poster',
      src: '/media/bia-motion-story-poster.jpg',
      decorative: true,
      status: 'approved',
    },
  ],
  // Role families and openings still require source material from BIA.
  careersAreas: [],
  // Do not mix metrics into narrative copy. Add metrics here only when BIA
  // supplies an approved value.
  metrics: [],
  placeholders: [
    {
      id: 'contact-details',
      label: copy(
        'Datos de contacto por confirmar.',
        'Contact details to be confirmed.',
      ),
      status: 'placeholder',
    },
    {
      id: 'current-openings',
      label: copy(
        'Vacantes actuales por confirmar.',
        'Current openings to be confirmed.',
      ),
      status: 'placeholder',
    },
  ],
};
