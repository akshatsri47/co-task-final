"use client"
import { useState,useEffect } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from '@/utils/supabase/client';
import Sidebar from "../components/Sidebar";
import Text2 from "../components/Text2";
import { Search, CircleCheck } from "lucide-react";
import Mountain from "../../components/ui/right"

export default function Dashboard() {
  const [profile, setProfile] = useState({ name: 'User', avatar: null });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('Auth error:', authError);
          setLoading(false);
          return;
        }
        
        // Get user's profile data
        const { data, error } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile({
            name: data.name || 'User',
            avatar: data.avatar || null
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, []);
  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col w-full px-8 py-6">
        {/* Header with title and search */}
        <div className="flex justify-between items-center mb-8">
          <Text2
            subheading="THE LOST JUNGLE"
            heading="let's check your progress"
          />
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for anything" 
              className="pl-10 pr-4 py-2 rounded-full bg-green-50 text-gray-600 w-60"
            />
          </div>
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Greeting card */}
          <Card className="p-6 bg-white shadow-sm">
            <CardContent className="p-0">
              <h3 className="text-lg font-medium mb-4">Hi, {profile.name}</h3>
              <div className="flex gap-3 flex-wrap">
                <button className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:bg-gray-50">
                  your analysis
                </button>
                <button className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:bg-gray-50">
                  productivity methods
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Focus Work card */}
          <Card className="p-6 bg-white shadow-sm">
            <CardContent className="p-0">
              <h3 className="text-sm text-gray-600 mb-1">Flow: Did you dedicate time to Focus Work</h3>
              <div className="flex gap-2 mb-4">
                <CircleCheck className="text-blue-500" size={24} />
                <CircleCheck className="text-blue-500" size={24} />
                <CircleCheck className="text-blue-500" size={24} />
                <CircleCheck className="text-gray-200" size={24} />
                <CircleCheck className="text-gray-200" size={24} />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold">FOCUS SESSIONS<br />on 3 out of 5 days</p>
                <button className="text-xs text-gray-500">edit</button>
              </div>
            </CardContent>
          </Card>

          {/* Shift Focus card */}
          <Card className="p-6 bg-white shadow-sm">
            <CardContent className="p-0">
              <h3 className="text-lg font-medium mb-4">Did you shift your focus too much</h3>
              {/* Content would go here */}
            </CardContent>
          </Card>

          {/* Upcoming Schedule card */}
          <Card className="p-6 bg-white shadow-sm">
            <CardContent className="p-0">
              <h3 className="text-lg font-medium mb-4">Upcoming Schedule</h3>
              <div className="flex flex-col gap-3">
                <button className="w-full px-4 py-3 rounded-full border border-gray-200 text-sm text-left">
                  <span className="font-medium">Personal Workspace</span>
                  <br />
                  <span className="text-gray-500">Website Design</span>
                </button>
                <button className="w-full px-4 py-3 rounded-full border border-gray-200 text-sm text-left">
                  <span className="font-medium">group3456</span>
                  <br />
                  <span className="text-gray-500">DSA questions</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Mountain />
    </div>
  );
}