import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useAuthContext from '../context/useAuthContext';

export default function useSavedInputs(algorithmId) {
  const { user } = useAuthContext();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!supabase || !user || !algorithmId) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('saved_inputs')
      .select('id, name, input_json, created_at')
      .eq('user_id', user.id)
      .eq('algorithm_id', algorithmId)
      .order('created_at', { ascending: false });
    setIsLoading(false);
    if (!error && data) {
      setItems(data);
    }
  }, [algorithmId, user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const saveInput = useCallback(
    async (name, inputJson) => {
      if (!supabase || !user) return { error: new Error('Not signed in') };
      const { error } = await supabase.from('saved_inputs').insert({
        user_id: user.id,
        algorithm_id: algorithmId,
        name,
        input_json: inputJson,
      });
      if (!error) {
        fetchItems();
      }
      return { error };
    },
    [algorithmId, fetchItems, user],
  );

  const deleteInput = useCallback(
    async (id) => {
      if (!supabase || !user) return { error: new Error('Not signed in') };
      const { error } = await supabase.from('saved_inputs').delete().eq('id', id);
      if (!error) {
        fetchItems();
      }
      return { error };
    },
    [fetchItems, user],
  );

  return {
    items,
    isLoading,
    saveInput,
    deleteInput,
  };
}
