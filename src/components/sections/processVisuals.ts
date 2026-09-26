export const PROCESS_VISUAL_VARIANT_IDS = [
  'seed',
  'harvest',
  'processing',
  'roasting',
  'grinding',
  'quality',
  'distribution',
] as const;

export type ProcessVisualVariantId = (typeof PROCESS_VISUAL_VARIANT_IDS)[number];

export interface ProcessVisualVariant {
  id: ProcessVisualVariantId;
  index: number;
  motif: string;
  accent: string;
}

const PROCESS_VISUAL_VARIANTS: readonly ProcessVisualVariant[] = [
  { id: 'seed', index: 0, motif: 'seed-core', accent: '#b56e4b' },
  { id: 'harvest', index: 1, motif: 'harvest-arc', accent: '#5d7b68' },
  { id: 'processing', index: 2, motif: 'processing-strata', accent: '#2c6c96' },
  { id: 'roasting', index: 3, motif: 'roasting-bloom', accent: '#b56e4b' },
  { id: 'grinding', index: 4, motif: 'grinding-particles', accent: '#627383' },
  { id: 'quality', index: 5, motif: 'quality-balance', accent: '#5d7b68' },
  { id: 'distribution', index: 6, motif: 'distribution-network', accent: '#2c6c96' },
];

function getVariant(index: number): ProcessVisualVariant {
  return PROCESS_VISUAL_VARIANTS[index] ?? PROCESS_VISUAL_VARIANTS[0];
}

export function getProcessVisualVariant(index: number): ProcessVisualVariant {
  if (typeof index !== 'number' || Number.isNaN(index)) {
    return getVariant(0);
  }

  const normalizedIndex = Math.min(
    PROCESS_VISUAL_VARIANTS.length - 1,
    Math.max(0, Math.trunc(index)),
  );

  return getVariant(normalizedIndex);
}

export function getProcessVisualVariantForId(
  id: string | null | undefined,
): ProcessVisualVariant {
  const index = PROCESS_VISUAL_VARIANT_IDS.indexOf(id as ProcessVisualVariantId);

  return getVariant(index >= 0 ? index : 0);
}
