import { Play, House, FolderKanban, Search, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const iconClasses = "w-6 h-6 mx-4 my-3 transition-transform duration-300 ease-in-out transform hover:scale-110"; 

  return (
    <div className="flex flex-col h-full relative border-r border-gray-200 bg-white text-gray-800">
      <div className="absolute left-20 h-screen top-0 bottom-0 w-0.5 bg-blue-500"></div>

      {/* Icons container */}
      <div className="flex flex-col gap-8 mt-16">
        <Link href="/">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300 ease-in-out focus:outline-none">
            <House className={iconClasses} />
          </button>
        </Link>

        <Link href="/play">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300 ease-in-out focus:outline-none">
            <Play className={iconClasses} />
          </button>
        </Link>

        <Link href="/workspace">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300 ease-in-out focus:outline-none">
            <FolderKanban className={iconClasses} />
          </button>
        </Link>

        <Link href="/roadmap">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300 ease-in-out focus:outline-none">
            <Search className={iconClasses} />
          </button>
        </Link>

        <Link href="/workspaces">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300 ease-in-out focus:outline-none">
            <Plus className={iconClasses} />
          </button>
        </Link>

        <Link href="/settings">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300 ease-in-out focus:outline-none">
            <Settings className={iconClasses} />
          </button>
        </Link>
      </div>
    </div>
  );
}
