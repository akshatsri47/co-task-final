"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import Sidebar from "../components/Sidebar";
import Text2 from "../components/Text2";
import {
  Search,
  CircleCheck,
  User,
  Flame,
  Clock,
  Loader2,
  Plus,
  Trash,
  Check,
  DollarSign,
} from "lucide-react"; // Use DollarSign instead of CurrencyDollar

import RightSidebar from "../../components/ui/right";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [profile, setProfile] = useState({
    name: "User",
    avatar: null,
    coins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [streak, setStreak] = useState({ current_streak: 0, max_streak: 0 });
  const [streakLoading, setStreakLoading] = useState(true);

  // Todo state
  const [todos, setTodos] = useState([]);
  const [todoLoading, setTodoLoading] = useState(true);
  const [todoError, setTodoError] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // Get current user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error("Auth error:", authError);
          setLoading(false);
          return;
        }

        // Get user's profile data
        const { data, error } = await supabase
          .from("users")
          .select("name, avatar, coins")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (data) {
          setProfile({
            name: data.name || "User",
            avatar: data.avatar || null,
            coins: data.coins || 0, // Set the coins
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  // Fetch todos on mount
  useEffect(() => {
    async function fetchTodos() {
      try {
        setTodoLoading(true);
        const res = await fetch("/api/todos");
        const data = await res.json();

        if (res.ok) {
          setTodos(data.todos || []);
        } else {
          setTodoError(data.error || "Failed to fetch todos");
        }
      } catch (err) {
        console.error("Failed to fetch todos:", err);
        setTodoError("An error occurred while fetching todos");
      } finally {
        setTodoLoading(false);
      }
    }

    if (!loading) {
      fetchTodos();
    }
  }, [loading]);

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
        setTodoError(data.error || "Failed to add todo");
      }
    } catch (err) {
      console.error("Failed to add todo:", err);
      setTodoError("An error occurred while adding todo");
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
        setTodoError(data.error || "Failed to update todo");
      }
    } catch (err) {
      console.error("Failed to update todo:", err);
      setTodoError("An error occurred while updating todo");
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
        setTodoError(data.error || "Failed to delete todo");
      }
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setTodoError("An error occurred while deleting todo");
    }
  };

  // Fetch streak data and update it on login
  useEffect(() => {
    async function fetchAndUpdateStreak() {
      setStreakLoading(true);
      try {
        // Call the streak API to update the streak
        const updateResponse = await fetch("/api/streaks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (updateResponse.ok) {
          const data = await updateResponse.json();
          setStreak(data.streak);
        } else {
          console.error("Failed to update streak");

          // Try to get the current streak without updating
          const getResponse = await fetch("/api/streaks");
          if (getResponse.ok) {
            const data = await getResponse.json();
            setStreak(data.streak);
          }
        }
      } catch (err) {
        console.error("Error handling streak:", err);
      } finally {
        setStreakLoading(false);
      }
    }

    if (!loading) {
      fetchAndUpdateStreak();
    }
  }, [loading]);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  // Individual Todo Item Component
  const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
      <div className="flex items-center h-14 group mb-2">
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

  return (
    <div className="flex flex-row min-h-screen bg-gray-50 relative">
      <Sidebar />

      <div className="flex flex-col w-full px-8 py-6">
        {/* Header with title, search, profile, and coins */}
        <div className="flex justify-between items-center mb-8">
          <Text2
            subheading="THE LOST JUNGLE"
            heading="let's check your progress"
          />
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search for anything"
                className="pl-10 pr-4 py-2 rounded-full bg-green-50 text-gray-600 w-60"
              />
            </div>

            {/* Profile and coins section */}
            <div className="flex items-center gap-4">
              {/* Coins Icon */}
              {/* Coins Icon */}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="text-yellow-500" size={18} />{" "}
                {/* Updated to DollarSign */}
                <span>{profile.coins}</span>
              </div>

              {/* Profile icon button to toggle sidebar */}
              <button
                onClick={toggleRightSidebar}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Greeting card with streak */}
          <Card className="p-6 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Hi, {profile.name}</h3>
                <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                  <Flame className="text-amber-500" size={16} />
                  <span className="text-amber-700 font-medium">
                    {streakLoading ? "..." : streak.current_streak} day streak
                  </span>
                </div>
              </div>
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
              <h3 className="text-sm text-gray-600 mb-1">
                Flow: Did you dedicate time to Focus Work
              </h3>
              <div className="flex gap-2 mb-4">
                <CircleCheck className="text-blue-500" size={24} />
                <CircleCheck className="text-blue-500" size={24} />
                <CircleCheck className="text-blue-500" size={24} />
                <CircleCheck className="text-gray-200" size={24} />
                <CircleCheck className="text-gray-200" size={24} />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold">
                  FOCUS SESSIONS
                  <br />
                  on 3 out of 5 days
                </p>
                <button className="text-xs text-gray-500">edit</button>
              </div>
            </CardContent>
          </Card>

          {/* Streak details card */}
          <Card className="p-6 bg-white shadow-sm">
            <CardContent className="p-0">
              <h3 className="text-lg font-medium mb-4">Your Login Streak</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Streak:</span>
                  <div className="flex items-center gap-2">
                    <Flame className="text-amber-500" size={18} />
                    <span className="font-semibold text-lg">
                      {streakLoading ? "..." : streak.current_streak} days
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Longest Streak:</span>
                  <div className="flex items-center gap-2">
                    <Flame className="text-amber-500" size={18} />
                    <span className="font-semibold text-lg">
                      {streakLoading ? "..." : streak.max_streak} days
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">
                    Keep coming back daily to build your streak!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Todo Tasks Card */}
          <Card className="p-6 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Todo Tasks</h3>
                <button className="text-xs text-blue-500 hover:underline">
                  View All
                </button>
              </div>

              {/* Todo Add Form */}
              {isAddingTodo ? (
                <form onSubmit={handleAddTodo} className="mb-4">
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
                  className="bg-gray-100 mb-4 shadow-none hover:bg-gray-200 cursor-pointer"
                  onClick={() => setIsAddingTodo(true)}
                >
                  <CardContent className="p-4 text-gray-500 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add a Todo
                  </CardContent>
                </Card>
              )}

              {/* Todo List */}
              {todoLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              ) : todoError ? (
                <div className="text-center text-red-500 p-4">{todoError}</div>
              ) : todos.length === 0 ? (
                <div className="text-center text-gray-500 p-4">
                  No tasks found. Add some tasks to get started!
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {todos.slice(0, 5).map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodoCompletion}
                      onDelete={deleteTodo}
                    />
                  ))}
                  {todos.length > 5 && (
                    <div className="text-center text-sm text-gray-500 pt-2">
                      {todos.length - 5} more tasks...
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right sidebar with streak info */}
      <RightSidebar
        isOpen={showRightSidebar}
        onClose={toggleRightSidebar}
        profile={profile}
        loading={loading}
        streak={streak}
      />
    </div>
  );
}
