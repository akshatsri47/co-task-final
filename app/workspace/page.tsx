"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Plus, Trash, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProgressBarItem,GoalsColumn } from "../components/Goals";
import { HabitsColumn } from "../components/Habitcoloumn";
import useUserProfile from '@/hooks/useProfile';

/* ---------------------------------------------------------------------------
   PomodoroTimer Component
   A Pomodoro timer with selectable duration, start, pause, and reset functions.
   When the session is complete, it calls onSessionComplete to exit focus mode.
--------------------------------------------------------------------------- */
const PomodoroTimer = ({ completedTodos, onSessionComplete }) => {
  // Default duration: 25 minutes (in seconds)
  const defaultDuration = 25 * 60;
  const [duration, setDuration] = useState(defaultDuration);
  const [secondsLeft, setSecondsLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(true); // auto-start when displayed

  // Countdown effect
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      const timerId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      alert("Pomodoro session complete!");
      onSessionComplete && onSessionComplete();
    }
  }, [isRunning, secondsLeft, onSessionComplete]);

  // Handler functions
  const startTimer = () => {
    if (secondsLeft === 0) setSecondsLeft(duration);
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(duration);
  };

  const handleDurationChange = (e) => {
    const newDuration = Number(e.target.value);
    setDuration(newDuration);
    setSecondsLeft(newDuration);
    setIsRunning(false);
  };

  // Format seconds into mm:ss
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg relative">
      {/* Close Button in top right corner */}
      <Button
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={onSessionComplete}
      >
        <X size={24} />
      </Button>
      <h2 className="text-xl font-semibold mb-4">Pomodoro Timer</h2>
      <div className="mb-4">
        <select
          value={duration}
          onChange={handleDurationChange}
          className="p-2 border rounded"
        >
          <option value={25 * 60}>25 Minutes</option>
          <option value={50 * 60}>50 Minutes</option>
          <option value={15 * 60}>15 Minutes</option>
        </select>
      </div>
      <div className="text-4xl font-mono mb-4">{formatTime(secondsLeft)}</div>
      <div className="flex gap-2 mb-4">
        {isRunning ? (
          <Button onClick={pauseTimer} variant="outline">
            Pause
          </Button>
        ) : (
          <Button onClick={startTimer} variant="default">
            Start
          </Button>
        )}
        <Button onClick={resetTimer} variant="ghost">
          Reset
        </Button>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-medium mb-2">Completed Tasks</h3>
        {completedTodos && completedTodos.length > 0 ? (
          <ul className="list-disc list-inside">
            {completedTodos.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No completed tasks.</p>
        )}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   ProgressBarItem Component
   Renders a labelled progress bar.
--------------------------------------------------------------------------- */


/* ---------------------------------------------------------------------------
   GoalsColumn Component
   Displays progress bars and a button to start a focus session.
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
   TodoItem Component
--------------------------------------------------------------------------- */
const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center h-14 group">
      <div
        className={`${
          todo.completed ? "bg-emerald-500" : "bg-sky-400"
        } h-full w-12 flex items-center justify-center rounded-l-md cursor-pointer`}
        onClick={() => onToggle(todo.id, todo.completed)}
      >
        {todo.completed && <Check className="text-white" size={20} />}
      </div>
      <div
        className="bg-gray-200 h-full flex-grow flex items-center px-4 cursor-pointer"
        onClick={() => onToggle(todo.id, todo.completed)}
      >
        <span className={todo.completed ? "line-through text-gray-500" : ""}>
          {todo.title}
        </span>
      </div>
      <div className="hidden group-hover:flex bg-gray-200 h-full items-center justify-center p-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-500"
          onClick={() => onDelete(todo.id)}
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   TodoColumn Component
--------------------------------------------------------------------------- */
const TodoColumn = ({
  todos,
  loading,
  error,
  isAddingTodo,
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  setIsAddingTodo,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="col-span-4">
      <h2 className="font-medium text-lg mb-3">To Do's</h2>
      {isAddingTodo ? (
        <form onSubmit={handleAddTodo} className="mb-3">
          <div className="flex gap-2">
            <Input
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-grow"
              autoFocus
            />
            <Button
              type="submit"
              variant="default"
              className="bg-sky-400 hover:bg-sky-500"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingTodo(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Card
          className="bg-gray-100 mb-3 shadow-none hover:bg-gray-200 cursor-pointer"
          onClick={() => setIsAddingTodo(true)}
        >
          <CardContent className="p-4 text-gray-500 flex items-center">
            <Plus size={16} className="mr-2" />
            Add a To Do
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-gray-500 text-sm">Loading todos...</div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : todos.length === 0 ? (
          <div className="text-gray-500 text-sm">No todos yet</div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   HabitsAndTasks (Main Component)
   Combines all three columns, manages state and API calls, and also handles
   starting a focus session that blurs the background and shows the Pomodoro timer.
--------------------------------------------------------------------------- */
export default function HabitsAndTasks() {
  const { profile, loadings } = useUserProfile();
  
  // Display name with fallback
  const displayName = loadings ? 'Loading...' : (profile?.name || 'User');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/todos");
        const data = await res.json();
        res.ok
          ? setTodos(data.todos || [])
          : setError(data.error || "Failed to fetch todos");
      } catch (e) {
        setError("An error occurred while fetching todos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodoTitle }),
      });
      const data = await res.json();
      if (res.ok) {
        setTodos([data.todo, ...todos]);
        setNewTodoTitle("");
        setIsAddingTodo(false);
      } else {
        setError(data.error || "Failed to add todo");
      }
    } catch {
      setError("An error occurred while adding todo");
    }
  };

  // Toggle todo completion
  const toggleTodoCompletion = async (id, currentStatus) => {
    try {
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !currentStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setTodos(
          todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      } else {
        setError(data.error || "Failed to update todo");
      }
    } catch {
      setError("An error occurred while updating todo");
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      } else {
        setError(data.error || "Failed to delete todo");
      }
    } catch {
      setError("An error occurred while deleting todo");
    }
  };

  // Calculate completed todos for the Pomodoro timer display
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="relative">
      {/* Main content area; blur it if a focus session is active */}
      <div className={`flex flex-row min-h-screen ${isFocusMode ? "filter blur-sm" : ""}`}>
        <div className="flex flex-col w-full">
          {/* Profile banner */}
          <div className="bg-cyan-100 p-6 w-full">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-medium text-lg">{displayName}</h2>
           
              <Progress value={30} className="h-1.5 w-36 bg-gray-200" />
            </div>
          </div>

          {/* Columns */}
          <div className="max-w-5xl mx-auto w-full p-6 grid grid-cols-12 gap-6">
            <HabitsColumn />
            <TodoColumn
              todos={todos}
              loading={loading}
              error={error}
              isAddingTodo={isAddingTodo}
              newTodoTitle={newTodoTitle}
              setNewTodoTitle={setNewTodoTitle}
              handleAddTodo={handleAddTodo}
              setIsAddingTodo={setIsAddingTodo}
              onToggle={toggleTodoCompletion}
              onDelete={deleteTodo}
            />
            <GoalsColumn
              completedTodos={completedTodos}
              onStartFocus={() => setIsFocusMode(true)}
            />
          </div>
        </div>
      </div>

      {/* Focus Session Modal Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent background */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          {/* Modal content (PomodoroTimer) */}
          <div className="relative z-10">
            <PomodoroTimer
              completedTodos={completedTodos}
              onSessionComplete={() => setIsFocusMode(false)}
            />
            <Button
              onClick={() => setIsFocusMode(false)}
              variant="ghost"
              className="mt-4 block mx-auto"
            >
              End Focus Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
