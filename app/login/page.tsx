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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <button
        onClick={handleSignIn}
        className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}
