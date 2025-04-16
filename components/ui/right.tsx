'use client';

import React from 'react';
import Image from 'next/image';
import { X, Flame, Award } from 'lucide-react';
import Mountain from '../../public/hamburger.svg';

export default function RightSidebar({ isOpen, onClose, profile, loading, streak = { current_streak: 0, max_streak: 0 } }) {
  // Display name with fallback
  const displayName = loading ? 'Loading...' : (profile?.name || 'User');
  
  return (
    <div className={`fixed top-0 right-0 h-screen w-72 bg-[#d0eaf0] flex flex-col gap-4 items-center py-8 shadow-md transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <X size={16} />
      </button>
      
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
      
      {/* Streak information */}
      <div className="mt-2 flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
        <Flame className="text-amber-500" size={18} />
        <span className="text-amber-800 font-medium">{streak.current_streak} day streak</span>
      </div>
      
      {/* Streak achievements */}
      <div className="mt-3 w-48 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Award size={16} className="text-blue-500" />
          <span className="font-medium text-sm">Streak Achievements</span>
        </div>
        <div className="text-xs text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Current Streak:</span>
            <span className="font-medium">{streak.current_streak} days</span>
          </div>
          <div className="flex justify-between">
            <span>Longest Streak:</span>
            <span className="font-medium">{streak.max_streak} days</span>
          </div>
        </div>
      </div>

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