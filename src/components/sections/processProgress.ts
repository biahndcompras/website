export const PROCESS_STEP_COUNT = 7;

export interface ProcessProgressState {
  progress: number;
  activeStepIndex: number;
  stepProgress: number;
}

function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.min(1, Math.max(0, progress));
}

export function mapProcessProgress(progress: number): ProcessProgressState {
  const normalizedProgress = clampProgress(progress);
  const steppedProgress = normalizedProgress * PROCESS_STEP_COUNT;
  const activeStepIndex =
    normalizedProgress === 1
      ? PROCESS_STEP_COUNT - 1
      : Math.min(PROCESS_STEP_COUNT - 1, Math.floor(steppedProgress));

  return {
    progress: normalizedProgress,
    activeStepIndex,
    stepProgress:
      normalizedProgress === 1
        ? 1
        : steppedProgress - activeStepIndex,
  };
}
