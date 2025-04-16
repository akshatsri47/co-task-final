import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Plus, Trash, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link"; // Use Link component instead

export const ProgressBarItem = ({ label, value }) => {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-2 bg-gray-200" />
    </div>
  );
};

export const GoalsColumn = ({ completedTodos, onStartFocus }) => {
  return (
    <div className="col-span-4 flex flex-col items-center">
      <h2 className="font-medium text-lg mb-3 flex items-center">
        FOCUS ON YOUR GOALS
        <span className="bg-gray-200 w-6 h-6 rounded-full ml-2"></span>
      </h2>
      <div className="mb-6 w-full">
        <Link href="/roadmap" className="block w-full">
          <Button 
            className="rounded-full bg-cyan-100 text-cyan-800 hover:bg-cyan-200 px-4 py-2 h-auto w-full justify-start"
          >
            Personalised Roadmap
          </Button>
        </Link>
        <Link href="/roadmap" className="block w-full mt-2">
          <Button 
            className="rounded-full bg-cyan-100 text-cyan-800 hover:bg-cyan-200 px-4 py-2 h-auto w-full"
          >
            Co-Task AI
          </Button>
        </Link>
      </div>
      <div className="mb-6 w-full">
        <ProgressBarItem label="lorem ipsum" value={75} />
        <ProgressBarItem label="SATVJ SVM" value={50} />
        <ProgressBarItem label="musa mosd" value={30} />
      </div>
      <div className="mt-4">
        <Button
          onClick={onStartFocus}
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Start Focus Session
        </Button>
      </div>
    </div>
  );
};