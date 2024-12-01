import type { StudyCard } from '../types/learning';
import type { DifficultyWeight } from '../constants/study';
import { BASE_INTERVALS, DIFFICULTY_WEIGHTS } from '../constants/study';

const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 2.5;
const EASE_BONUS = 0.15;
const EASE_PENALTY = 0.2;

export function calculateNextInterval(
  card: StudyCard,
  difficulty: DifficultyWeight
): number {
  // Validation des paramètres
  if (!card) {
    console.warn('Card object is undefined in calculateNextInterval');
    return BASE_INTERVALS[difficulty]; // Utiliser l'intervalle de base par défaut
  }

  // Valeurs par défaut si les propriétés sont manquantes
  const repetitions = card.repetitions ?? 0;
  const easeFactor = card.easeFactor ?? 2.5;
  const lastInterval = card.lastInterval ?? BASE_INTERVALS[difficulty];
  
  // For failed cards, reset to 1 day
  if (difficulty === 'FAIL') {
    return 1;
  }

  // Calculate interval based on repetitions and difficulty
  let interval: number;
  if (repetitions === 0) {
    interval = BASE_INTERVALS[difficulty]; // Correction ici
  } else {
    const factor = easeFactor * (1 + (DIFFICULTY_WEIGHTS[difficulty] - 3) * 0.1);
    interval = Math.round(lastInterval * factor);
  }

  // Ensure minimum interval of 1 day
  return Math.max(1, interval);
}

export function calculateNewEaseFactor(
  currentEaseFactor: number,
  difficulty: DifficultyWeight
): number {
  const difficultyValue = DIFFICULTY_WEIGHTS[difficulty];
  let newEaseFactor = currentEaseFactor;

  if (difficultyValue >= 4) { // EASY or PERFECT
    newEaseFactor += EASE_BONUS;
  } else if (difficultyValue <= 2) { // FAIL or HARD
    newEaseFactor -= EASE_PENALTY;
  }

  // Ensure ease factor stays within bounds
  return Math.min(MAX_EASE_FACTOR, Math.max(MIN_EASE_FACTOR, newEaseFactor));
}

export function calculateNextReview(
  card: StudyCard,
  difficulty: DifficultyWeight
): StudyCard {
  const interval = calculateNextInterval(card, difficulty);
  const easeFactor = calculateNewEaseFactor(card.easeFactor, difficulty);
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...card,
    status: difficulty === 'FAIL' ? 'learning' : 'reviewing',
    nextReviewDate: nextReviewDate.toISOString(),
    repetitions: difficulty === 'FAIL' ? 0 : card.repetitions + 1,
    easeFactor,
    lastInterval: interval
  };
}

export function shouldReviewCard(card: StudyCard): boolean {
  if (!card.nextReviewDate) return true;
  
  const now = new Date();
  const reviewDate = new Date(card.nextReviewDate);
  
  return now >= reviewDate;
}