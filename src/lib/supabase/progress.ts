import { supabase } from './client';
import type { DifficultyWeight } from '../../constants/study';
import { calculateNextInterval, calculateNewEaseFactor } from '../spaced-repetition';
import type { StudyCard } from '../../types/learning';

export async function updateUserProgress(
  userId: string,
  deckId: string,
  cardId: string,
  difficulty: DifficultyWeight,
  card: StudyCard
): Promise<void> {
  try {
    console.log('Updating progress for card:', cardId, 'with difficulty:', difficulty);
    
    // Calculate new intervals and factors
    const interval = calculateNextInterval(card, difficulty);
    const easeFactor = calculateNewEaseFactor(card.easeFactor, difficulty);

    // Start a transaction
    const { error: transactionError } = await supabase.rpc('begin_transaction');
    if (transactionError) throw transactionError;

    try {
      // 1. Insert review history
      const { error: reviewError } = await supabase
        .from('review_history')
        .insert({
          user_id: userId,
          card_id: cardId,
          difficulty,
          interval,
          ease_factor: easeFactor,
          review_date: new Date().toISOString()
        });

      if (reviewError) throw reviewError;

      // 2. Calculate XP reward
      const xpToAdd = calculateXPReward(difficulty);
      
      // 3. Update user progress with the new XP using the SQL function
      const { data: updatedXP, error: xpError } = await supabase
        .rpc('update_daily_xp', {
          user_id_param: userId,
          deck_id_param: deckId,
          xp_to_add: xpToAdd
        });

      if (xpError) throw xpError;

      // 4. Update other progress stats
      const { error: updateError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          deck_id: deckId,
          cards_studied: supabase.raw('COALESCE(cards_studied, 0) + 1'),
          correct_answers: supabase.raw(`COALESCE(correct_answers, 0) + ${difficulty !== 'FAIL' ? 1 : 0}`),
          daily_xp: updatedXP,
          last_reward_date: new Date().toISOString()
        });

      if (updateError) throw updateError;

      // Commit transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw commitError;

    } catch (error) {
      // Rollback on any error
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

function calculateXPReward(difficulty: DifficultyWeight): number {
  const XP_REWARDS = {
    FAIL: 0,
    HARD: 5,
    GOOD: 8,
    EASY: 10,
    PERFECT: 15
  };

  return XP_REWARDS[difficulty];
}