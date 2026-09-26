import { describe, expect, it } from 'vitest';
import {
  PROCESS_VISUAL_VARIANT_IDS,
  getProcessVisualVariant,
  getProcessVisualVariantForId,
} from './processVisuals';

describe('process cinematic visual variants', () => {
  it('defines exactly one deterministic variant for each of the seven process steps', () => {
    expect(PROCESS_VISUAL_VARIANT_IDS).toEqual([
      'seed',
      'harvest',
      'processing',
      'roasting',
      'grinding',
      'quality',
      'distribution',
    ]);

    const variants = PROCESS_VISUAL_VARIANT_IDS.map((_, index) =>
      getProcessVisualVariant(index),
    );

    expect(variants.map((variant) => variant.id)).toEqual([
      ...PROCESS_VISUAL_VARIANT_IDS,
    ]);
    expect(new Set(variants.map((variant) => variant.motif)).size).toBe(7);
    expect(variants.every((variant) => variant.index >= 0 && variant.index < 7)).toBe(
      true,
    );
  });

  it('selects the expected variant at every step boundary', () => {
    expect(getProcessVisualVariant(0).id).toBe('seed');
    expect(getProcessVisualVariant(1).id).toBe('harvest');
    expect(getProcessVisualVariant(2).id).toBe('processing');
    expect(getProcessVisualVariant(3).id).toBe('roasting');
    expect(getProcessVisualVariant(4).id).toBe('grinding');
    expect(getProcessVisualVariant(5).id).toBe('quality');
    expect(getProcessVisualVariant(6).id).toBe('distribution');
  });

  it('falls back safely for out-of-range and unknown selections', () => {
    const seed = getProcessVisualVariant(0);
    const distribution = getProcessVisualVariant(6);

    expect(getProcessVisualVariant(-1)).toBe(seed);
    expect(getProcessVisualVariant(7)).toBe(distribution);
    expect(getProcessVisualVariant(Number.NaN)).toBe(seed);
    expect(getProcessVisualVariant(Number.POSITIVE_INFINITY)).toBe(
      distribution,
    );
    expect(getProcessVisualVariantForId('quality').id).toBe('quality');
    expect(getProcessVisualVariantForId('unknown-step')).toBe(seed);
    expect(getProcessVisualVariantForId(undefined)).toBe(seed);
  });
});
