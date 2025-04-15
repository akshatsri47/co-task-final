'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function GoogleSignIn() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <button 
      onClick={handleSignIn}
      className="bg-white p-2 rounded shadow flex items-center gap-2"
    >
      Sign in with Google
    </button>
  );
}