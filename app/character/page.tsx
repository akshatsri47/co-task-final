'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Characters from '../../public/character1.svg';
// Import additional character SVGs
import Characters2 from '../../public/character2.svg';
// import Characters3 from '../../public/character3.svg';

export default function Character() {
  const [name, setName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  // Add more characters to this array as you create them
  const characters = [
    { component: Characters, value: 'https://bkeryhuxhupoavxfaash.supabase.co/storage/v1/object/public/avatar//character1.svg' },
    { component: Characters2, value: 'https://bkeryhuxhupoavxfaash.supabase.co/storage/v1/object/public/avatar//character2.svg' },
    // { component: Characters3, value: '/character3.svg' },
  ];

  // Get current user on page load
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          router.push('/login');
          return;
        }
        
        if (!user) {
          console.log('No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('User authenticated:', user.id);
        setUser(user);
        
        // Check if user already has a character/name
        const { data, error: dbError } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', user.id)
          .single();
          
        if (dbError) {
          console.error('Error fetching user data:', dbError);
        }
        
        if (data && data.name) {
          console.log('User has name:', data.name);
          setName(data.name);
          
          // If user already has a profile, redirect to dashboard
          if (data.avatar) {
            console.log('User already has avatar, redirecting to dashboard');
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error in getUser:', error);
      }
    };
    
    getUser();
  }, [router, supabase]);

  const nextCharacter = () => {
    setCurrentCharacter((prev) => (prev + 1) % characters.length);
  };

  const prevCharacter = () => {
    setCurrentCharacter((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const handleNameClick = () => {
    setShowInput(true);
    setError('');
    // router.push('/dashboard'); // 👈 redirecting to dashboard
  };
  

  const handleSaveCharacter = async () => {
    console.log("Save button clicked");
    setError('');
    
    if (!user) {
      console.error("No user found");
      setError('You must be logged in');
      return;
    }
    
    if (!name.trim()) {
      console.error("Name is empty");
      setError('Please enter a name');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Getting avatar path");
      
      // Get the avatar URL from the selected character
      const avatarPath = characters[currentCharacter].value;
      console.log("Avatar path:", avatarPath);
      
      console.log("Calling API...");
      // Call the API to update the user profile
      const response = await fetch('/api/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          avatarType: 'predefined',
          avatarPath: avatarPath
        }),
      });
      
      console.log("API response status:", response.status);
      const data = await response.json();
      console.log("API response data:", data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      // Redirect to dashboard or home
      console.log("Redirecting to dashboard");
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error saving character:', error);
      setError(error.message || 'Failed to save character. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Display the current character component
  const CurrentCharacterComponent = characters[currentCharacter].component;

  return (
    <section className="relative flex flex-col items-center justify-start w-screen h-screen bg-[#F4FAF9] overflow-hidden">
      {/* Title */}
      <h1 className="mt-10 text-3xl font-bold text-gray-800">
        Choose a Traveller
      </h1>
      
      {/* Character & Arrows */}
      <div className="flex items-center justify-center mt-8">
  <button 
    onClick={prevCharacter} 
    className="mr-6 text-3xl font-bold text-gray-600 hover:text-gray-800"
    type="button"
  >
    &lt;
  </button>
  <div className="w-[200px] h-[280px] flex items-center justify-center">
    <CurrentCharacterComponent className="max-w-full max-h-full" />
  </div>
  <button 
    onClick={nextCharacter} 
    className="ml-6 text-3xl font-bold text-gray-600 hover:text-gray-800"
    type="button"
  >
    &gt;
  </button>
</div>
      
      {/* Name Input or Button */}
      <div className="mt-8">
      {showInput ? (
  <div className="flex flex-col items-center gap-2">
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter your name"
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
    />
    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}
    <button 
      onClick={handleSaveCharacter} // Change this to use handleSaveCharacter
      className="px-6 py-3 bg-teal-200 text-gray-800 rounded-lg shadow hover:bg-teal-300 z-10"
      type="button"
    >
      {loading ? 'Saving...' : 'Save & Continue'}
    </button>
  </div>
) : (
  <button 
    onClick={handleNameClick}
    className="px-6 py-3 bg-teal-200 text-gray-800 rounded-lg shadow hover:bg-teal-300 z-10"
    type="button"
  >
    enter a name
  </button>
)}
      </div>
      
      {/* Bottom Wave / Mountain Image */}
      
    </section>
  );
}