import { useEffect, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';

interface UseSupabaseQueryResult<T> {
  data: T[] | null;
  error: PostgrestError | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  table: string,
  query?: {
    column?: string;
    value?: string | number;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      let queryBuilder = supabase.from(table).select('*');

      if (query?.column && query?.value) {
        queryBuilder = queryBuilder.eq(query.column, query.value);
      }

      if (query?.orderBy) {
        queryBuilder = queryBuilder.order(
          query.orderBy.column,
          { ascending: query.orderBy.ascending ?? true }
        );
      }

      if (query?.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      setData(data);
      setError(null);
    } catch (err) {
      setError(err as PostgrestError);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(query)]);

  return { data, error, loading, refetch: fetchData };
}