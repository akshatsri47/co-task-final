// app/about/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M30,10 L50,30 L70,10 L90,30 L90,90 L10,90 L10,30 L30,10 Z" fill="#2DD4BF" />
            <path d="M20,30 L40,15 L60,30 L80,15 L80,80 L20,80 L20,30 Z" fill="#14B8A6" />
            <path d="M30,50 L50,30 L70,50 L70,70 L30,70 L30,50 Z" fill="#0D9488" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About CoTask</h1>
          <p className="text-xl text-gray-700 mb-10">
            We believe task management shouldn't be a chore—it should be an adventure.
          </p>
          
          <div className="w-24 h-2 bg-teal-500 mx-auto mb-12 rounded-full"></div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-teal-600 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-40 h-40 text-teal-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L3 9v11a2 2 0 002 2h14a2 2 0 002-2V9l-9-7z" />
                    <path d="M12 6l-4 3v12h8V9l-4-3z" fill="white" />
                    <circle cx="12" cy="15" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <p className="text-lg text-gray-700 mb-4">
                The journey of CoTask began when a team of productivity enthusiasts and AI specialists recognized a common problem: traditional task management systems were draining the creativity and energy from teams.
              </p>
              <p className="text-lg text-gray-700">
                We set out to create something different—a platform that combines powerful AI capabilities with an engaging, adventure-themed experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-teal-50 to-transparent"></div>
          <svg className="absolute bottom-0 left-0 right-0 text-teal-600 opacity-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg">
            <p className="text-lg text-gray-700 mb-4">
              We're on a mission to revolutionize productivity by making task management exciting and effortless. CoTask turns mundane workflows into meaningful journeys, helping teams discover their potential, create remarkable results, and thrive in today's fast-paced work environment.
            </p>
            <div className="flex justify-center mt-8">
              <div className="inline-block p-1 rounded-full bg-gradient-to-r from-teal-500 to-green-400">
                <button className="px-6 py-2 bg-white rounded-full text-teal-600 font-medium hover:bg-transparent hover:text-white transition-all">
                  Join Our Adventure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The CoTask Difference */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-900 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">The CoTask Difference</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-sm">
              <div className="mb-4 text-teal-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Intelligence</h3>
              <p>Our smart task management system learns your work style and adapts to your priorities, creating a personalized productivity experience.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-sm">
              <div className="mb-4 text-teal-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Adventure-Driven Design</h3>
              <p>We've replaced sterile task lists with journey maps, achievements, and exploration-based workflows that make productivity engaging.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-sm">
              <div className="mb-4 text-teal-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p>CoTask transforms isolated work into shared adventures, where team members can see their collective progress through challenging terrain toward common goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
          <div className="bg-white rounded-lg p-8 shadow-md">
            <p className="text-lg text-gray-700 mb-6">
              Behind CoTask is a diverse group of developers, designers, and productivity experts who share a passion for reimagining how work gets done. We combine cutting-edge AI technology with human-centered design to create tools that don't just organize tasks—they inspire action.
            </p>
            <p className="text-lg text-gray-700 font-medium">
              Join us on this adventure, and discover how productivity can be both powerful and playful.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/get-started" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
              Begin Your Journey
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}