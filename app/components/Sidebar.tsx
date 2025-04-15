import { Play } from "lucide-react"
import { House } from 'lucide-react';
import { FolderKanban } from 'lucide-react';
import { Search } from 'lucide-react';
import { Plus } from "lucide-react";
import { Settings } from "lucide-react";
import Link from "next/link";


export default function Sidebar(){
    const iconClasses = "w-10 h-10 mx-4 my-3"; 
    
    return(
        <div className="flex flex-col h-full  relative border-r border-gray-200  ">
           
            <div className="absolute left-20 h-screen top-0 bottom-0 w-0.5 bg-blue-500"></div>
            
            {/* Icons container */}
            <div className="flex flex-col gap-14   h-full content-center mt-30 ">
                <House className={iconClasses} />
                <Play className={iconClasses} />
                <FolderKanban className={iconClasses} />
                <Search className={iconClasses} />
                <Plus className={iconClasses} />
                <Settings className={iconClasses} />
            </div>
        </div>
    )
}