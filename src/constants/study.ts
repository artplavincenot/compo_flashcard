export const DIFFICULTY_WEIGHTS = {
  FAIL: 1,    // Complete failure, review immediately
  HARD: 2,    // Difficult but remembered
  GOOD: 3,    // Remembered with some effort
  EASY: 4,    // Easily remembered
  PERFECT: 5  // Perfect recall
} as const;

export const STUDY_DURATIONS = {
  SHORT: 5,
  MEDIUM: 10,
  LONG: 15
} as const;

// Intervals in days for each difficulty level
export const BASE_INTERVALS = {
  FAIL: 1,     // Review next day
  HARD: 3,     // Review in 3 days
  GOOD: 7,     // Review in a week
  EASY: 14,    // Review in 2 weeks
  PERFECT: 30  // Review in a month
} as const;

export type DifficultyWeight = keyof typeof DIFFICULTY_WEIGHTS;
export type StudyDuration = typeof STUDY_DURATIONS[keyof typeof STUDY_DURATIONS];