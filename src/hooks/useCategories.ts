import { useSupabaseQuery } from './useSupabaseQuery';

export function useCategories() {
  const { data: decks, loading, error } = useSupabaseQuery('decks', {
    orderBy: { column: 'category', ascending: true }
  });

  const categories = decks
    ? Array.from(new Set(decks.map(deck => deck.category))).sort()
    : [];

  return {
    categories,
    loading,
    error
  };
}