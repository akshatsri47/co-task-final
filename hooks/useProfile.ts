// hooks/useUserProfile.js
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * Custom hook to fetch user profile data from Supabase
 * @param {Object} options - Hook options
 * @param {Array<string>} options.select - Fields to select from users table (defaults to ['name', 'avatar'])
 * @param {boolean} options.autoFetch - Whether to fetch automatically on mount (defaults to true)
 * @returns {Object} The hook state and methods
 */
export function useUserProfile(options = {}) {
  const { 
    select = ['name', 'avatar'],
    autoFetch = true 
  } = options;
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Convert array of fields to comma-separated string for Supabase query
  const selectFields = Array.isArray(select) ? select.join(', ') : select;
  
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Get current authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw authError;
      }
      
      if (!authUser) {
        setProfile(null);
        setUser(null);
        setLoading(false);
        return null;
      }
      
      setUser(authUser);
      
      // Get user profile data from users table
      const { data, error: profileError } = await supabase
        .from('users')
        .select(selectFields)
        .eq('id', authUser.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to fetch profile');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Auto fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, []);
  
  return { 
    profile,
    user,
    loading, 
    error,
    fetchProfile,
    setProfile
  };
}

export default useUserProfile;