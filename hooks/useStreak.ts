// hooks/useStreak.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export type StreakData = {
  current_streak: number;
  max_streak: number;
  last_login_date?: string;
};

export default function useStreak() {
  const [streak, setStreak] = useState<StreakData>({ current_streak: 0, max_streak: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Function to fetch streak data
  const fetchStreak = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Authentication required');
      }
      
      // Get streak data
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak, max_streak, last_login_date')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGSQL_NO_ROWS_RETURNED') {
        throw new Error(error.message);
      }
      
      if (data) {
        setStreak(data);
      } else {
        setStreak({ current_streak: 0, max_streak: 0 });
      }
    } catch (err: any) {
      console.error('Failed to fetch streak:', err);
      setError(err.message || 'Failed to fetch streak');
    } finally {
      setLoading(false);
    }
  };

  // Function to update streak
  const updateStreak = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Authentication required');
      }
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Check for existing streak
      const { data: existingStreak, error: fetchError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGSQL_NO_ROWS_RETURNED') {
        throw new Error(fetchError.message);
      }
      
      let newStreak;
      
      if (!existingStreak) {
        // Create new streak
        const { data, error } = await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 1,
            max_streak: 1,
            last_login_date: today
          })
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        
        newStreak = data;
      } else {
        // Update existing streak
        const lastLoginDate = existingStreak.last_login_date;
        
        // Calculate day difference
        const lastLogin = new Date(lastLoginDate);
        const currentDate = new Date(today);
        
        // Reset time components to avoid timezone issues
        lastLogin.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        const dayDifference = Math.round((currentDate.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));
        
        let newCurrentStreak = existingStreak.current_streak;
        let newMaxStreak = existingStreak.max_streak;
        
        if (dayDifference === 0) {
          // Already logged in today - no change
          setStreak(existingStreak);
          setLoading(false);
          return true;
        } else if (dayDifference === 1) {
          // Consecutive day - increment streak
          newCurrentStreak += 1;
          if (newCurrentStreak > newMaxStreak) {
            newMaxStreak = newCurrentStreak;
          }
        } else {
          // Streak broken - reset to 1
          newCurrentStreak = 1;
        }
        
        // Update database
        const { data, error } = await supabase
          .from('user_streaks')
          .update({
            current_streak: newCurrentStreak,
            max_streak: newMaxStreak,
            last_login_date: today
          })
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        
        newStreak = data;
      }
      
      setStreak(newStreak);
      return true;
    } catch (err: any) {
      console.error('Error updating streak:', err);
      setError(err.message || 'Failed to update streak');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initialize streak data on mount
  useEffect(() => {
    fetchStreak();
  }, []);

  return {
    streak,
    loading,
    error,
    updateStreak,
    refreshStreak: fetchStreak
  };
}