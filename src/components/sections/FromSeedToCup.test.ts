import { describe, expect, it } from 'vitest';
import {
  PROCESS_STEP_COUNT,
  mapProcessProgress,
} from './processProgress';

describe('process cinematic progress', () => {
  it('maps the seven BIA process steps at both timeline boundaries', () => {
    expect(PROCESS_STEP_COUNT).toBe(7);
    expect(mapProcessProgress(0)).toEqual({
      progress: 0,
      activeStepIndex: 0,
      stepProgress: 0,
    });
    expect(mapProcessProgress(1)).toEqual({
      progress: 1,
      activeStepIndex: 6,
      stepProgress: 1,
    });

    for (let stepIndex = 0; stepIndex < PROCESS_STEP_COUNT; stepIndex += 1) {
      expect(mapProcessProgress(stepIndex / PROCESS_STEP_COUNT).activeStepIndex).toBe(
        stepIndex,
      );
    }
  });

  it('returns the same state when the same scroll position is revisited', () => {
    const descending = mapProcessProgress(0.72);
    const ascending = mapProcessProgress(0.28);

    expect(descending.progress).toBe(0.72);
    expect(descending.activeStepIndex).toBe(5);
    expect(descending.stepProgress).toBeCloseTo(0.04, 10);
    expect(ascending.progress).toBe(0.28);
    expect(ascending.activeStepIndex).toBe(1);
    expect(ascending.stepProgress).toBeCloseTo(0.96, 10);
    expect(mapProcessProgress(0.72)).toEqual(descending);
    expect(mapProcessProgress(0.28)).toEqual(ascending);
  });

  it('keeps active-step indices inside the seven-step range', () => {
    const activeIndices = Array.from({ length: 11 }, (_, index) =>
      mapProcessProgress(index / 10).activeStepIndex,
    );

    expect(activeIndices).toEqual([0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6]);
  });

  it('clamps invalid and out-of-range progress to safe timeline values', () => {
    expect(mapProcessProgress(-0.25)).toEqual({
      progress: 0,
      activeStepIndex: 0,
      stepProgress: 0,
    });
    expect(mapProcessProgress(1.25)).toEqual({
      progress: 1,
      activeStepIndex: 6,
      stepProgress: 1,
    });
    expect(mapProcessProgress(Number.NaN)).toEqual({
      progress: 0,
      activeStepIndex: 0,
      stepProgress: 0,
    });
    expect(mapProcessProgress(Number.NEGATIVE_INFINITY)).toEqual({
      progress: 0,
      activeStepIndex: 0,
      stepProgress: 0,
    });
    expect(mapProcessProgress(Number.POSITIVE_INFINITY)).toEqual({
      progress: 1,
      activeStepIndex: 6,
      stepProgress: 1,
    });
  });
});
