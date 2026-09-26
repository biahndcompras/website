// BIA content contract
export type Locale = 'es' | 'en';
export type ContentStatus = 'approved' | 'placeholder';

export interface LocalizedCopy {
  es: string;
  en: string;
}

export type BiaHubId = 'coffee' | 'culinary' | 'snacks' | 'partners-food-service';
export type CoffeeBrandId = 'el-indio' | 'cafe-maya' | 'oro-puro' | 'medalla';
export type OriginRegionId = 'copan' | 'marcala' | 'montecillos';

export interface BiaHub {
  id: BiaHubId;
  name: LocalizedCopy;
  description: LocalizedCopy;
  status: ContentStatus;
}

export interface CoffeeBrand {
  id: CoffeeBrandId;
  name: LocalizedCopy;
  description: LocalizedCopy;
  status: ContentStatus;
}

export interface OriginRegion {
  id: OriginRegionId;
  name: LocalizedCopy;
  description: LocalizedCopy;
  status: ContentStatus;
}

export interface ValueProposition {
  id: string;
  title: LocalizedCopy;
  description: LocalizedCopy;
  status: ContentStatus;
}

export interface ProcessStep {
  id: string;
  title: LocalizedCopy;
  description: LocalizedCopy;
  status: ContentStatus;
}

export type MediaAssetKind = 'image' | 'video' | 'poster';

export interface MediaAsset {
  id: string;
  kind: MediaAssetKind;
  src: string;
  alt?: string;
  decorative?: boolean;
  status: ContentStatus;
}

export interface CareersArea {
  id: string;
  title: LocalizedCopy;
  description: LocalizedCopy;
  status: ContentStatus;
}

export interface BiaOrganization {
  name: string;
  parent: string;
  description: LocalizedCopy;
  status: ContentStatus;
}

export interface BiaNarrative {
  id: string;
  copy: LocalizedCopy;
  status: ContentStatus;
}

export interface BiaMetric {
  id: string;
  label: LocalizedCopy;
  value: string | null;
  status: ContentStatus;
}

export interface BiaPlaceholder {
  id: string;
  label: LocalizedCopy;
  status: ContentStatus;
}

export interface BiaContent {
  organization: BiaOrganization;
  narrative: BiaNarrative[];
  hubs: BiaHub[];
  brands: CoffeeBrand[];
  originRegions: OriginRegion[];
  valuePropositions: ValueProposition[];
  processSteps: ProcessStep[];
  media: MediaAsset[];
  careersAreas: CareersArea[];
  metrics: BiaMetric[];
  placeholders: BiaPlaceholder[];
}
