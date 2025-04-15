'use client';

import React from 'react';
import Image from 'next/image';
import Mountain from '../../public/hamburger.svg';
import useUserProfile from '@/hooks/useProfile';

export default function RightSidebar() {
  const { profile, loading } = useUserProfile();
  
  // Display name with fallback
  const displayName = loading ? 'Loading...' : (profile?.name || 'User');
  
  return (
    <div className="fixed top-0 right-0 h-screen w-72 bg-[#d0eaf0] flex flex-col gap-4 items-center py-8 shadow-md">
      {/* User avatar from database */}
      <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
        {profile?.avatar ? (
          <Image
            src={profile.avatar}
            alt="Profile Picture"
            width={96}
            height={96}
            className="rounded-full"
          />
        ) : (
          // Fallback placeholder if no avatar
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-2xl text-gray-500">
              {!loading && displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* User Name from database */}
      <h2 className="mt-3 text-xl font-semibold text-gray-800">
        {displayName}
      </h2>

      {/* Buttons */}
      <button className="mt-5 w-48 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        EDIT YOUR PROFILE
      </button>
      <button className="mt-2 w-48 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        ACHIEVEMENTS
      </button>
      <button className="mt-2 w-48 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        MOUNTAIN GEAR
      </button>

      {/* Spacer pushes the mountain to the bottom */}
      <div className="mt-auto w-full flex justify-center">
        {/* Mountain SVG at the bottom */}
        <Mountain className="w-full h-auto" />
      </div>
    </div>
  );
}