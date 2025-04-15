// /workspace
"use client";
import { useState, useEffect } from 'react';
import { getWorkspaces } from '@/utils/api';
import Link from 'next/link';
import CreateWorkspaceModal from '../components/CreatespaceModal';

export default function Home() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    async function loadWorkspaces() {
      setLoading(true);
      const { data, error } = await getWorkspaces();
      if (error) {
        console.error('Failed to load workspaces:', error);
      } else {
        setWorkspaces(data || []);
      }
      setLoading(false);
    }
    
    loadWorkspaces();
  }, []);
  
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-sm rounded-lg p-6 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Workspaces</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Workspace
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading workspaces...</p>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-700">No workspaces yet</h3>
            <p className="mt-1 text-gray-500">Create your first workspace to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workspaces.map(workspace => (
              <Link href={`/workspaces/${workspace.id}`} key={workspace.id}>
                <div className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-medium text-lg text-gray-900">{workspace.name}</h3>
                  {workspace.description && (
                    <p className="text-gray-600 mt-1 text-sm">{workspace.description}</p>
                  )}
                  <div className="flex items-center mt-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      workspace.role === 'owner' 
                        ? 'bg-purple-100 text-purple-800' 
                        : workspace.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workspace.role}
                    </span>
                    {workspace.creator && (
                      <span className="text-xs text-gray-500 ml-2">
                        Created by {workspace.creator.name || 'Unknown'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <CreateWorkspaceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(newWorkspace) => {
          setWorkspaces(prev => [...prev, newWorkspace]);
          setIsModalOpen(false);
        }}
      />
    </main>
  );
}