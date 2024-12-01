import type { StudyCard } from '../types/learning';
import { DIFFICULTY_WEIGHTS, type DifficultyWeight } from '../constants/study';

export function shuffleCards<T>(cards: T[]): T[] {
  if (!Array.isArray(cards)) {
    console.warn('Invalid input: cards must be an array');
    return [];
  }

  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function rotateCards(
  cards: StudyCard[],
  currentIndex: number,
  difficulty: DifficultyWeight
): number {
  if (!cards?.length) {
    console.warn('No cards provided for rotation');
    return 0;
  }

  if (currentIndex < 0 || currentIndex >= cards.length) {
    console.warn('Invalid current index:', currentIndex);
    return 0;
  }

  const weight = DIFFICULTY_WEIGHTS[difficulty];
  const rotation = Math.max(1, Math.min(cards.length - 1, weight));
  return (currentIndex + rotation) % cards.length;
}