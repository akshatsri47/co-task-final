"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Plus, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// HabitItem uses the `completed_at` timestamp to check if it was marked as complete today.
export const HabitItem = ({ habit, onToggleComplete, onDelete }) => {
  // Determine if habit is marked as complete today by comparing the date portion.
  const isCompletedToday = habit.completed_at
    ? new Date(habit.completed_at).toDateString() === new Date().toDateString()
    : false;

  return (
    <div className="flex items-center h-14 group">
      {/* Left toggle area: clicking toggles completion status */}
      <div 
        className={`h-full w-12 flex items-center justify-center rounded-l-md cursor-pointer ${isCompletedToday ? "bg-emerald-500" : "bg-gray-100"}`}
        onClick={() => onToggleComplete(habit.id)}
      >
        {isCompletedToday ? (
          <Check className="text-white" size={20} />
        ) : (
          <Check className="text-gray-500" size={20} />
        )}
      </div>
      {/* Habit info */}
      <div className="bg-gray-200 h-full flex-grow px-4 flex items-center justify-between">
        <span>{habit.name}</span>
        <span className="text-sm text-gray-500">Streak: {habit.streak}</span>
      </div>
      {/* Right completion toggle (duplicate action on hover) */}
      <div 
        className={`h-full w-12 flex items-center justify-center cursor-pointer ${isCompletedToday ? "bg-emerald-500" : "bg-gray-100"}`}
        onClick={() => onToggleComplete(habit.id)}
      >
        {isCompletedToday && <Check className="text-white" size={16} />}
      </div>
      {/* Delete button: only shown on hover */}
      <div className="hidden group-hover:flex h-full items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(habit.id);
          }}
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
};

// HabitsColumn fetches and displays habits and integrates with the API endpoints.
export const HabitsColumn = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  // Load habits on mount.
  useEffect(() => {
    fetchHabits();
  }, []);

  // Fetch habits from the API.
  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/habits");
      const data = await response.json();
      
      if (response.ok) {
        setHabits(data.habits || []);
      } else {
        setError(data.error || "Failed to fetch habits");
      }
    } catch (err) {
      setError("An error occurred while fetching habits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new habit.
  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newHabitName }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setHabits([data.habit, ...habits]);
        setNewHabitName("");
        setIsAddingHabit(false);
      } else {
        setError(data.error || "Failed to add habit");
      }
    } catch (err) {
      setError("An error occurred while adding habit");
      console.error(err);
    }
  };

  // Toggle the completion status for a habit.
  const toggleHabitCompletion = async (habitId) => {
    try {
      const habit = habits.find((h) => h.id === habitId);
      const isCompletedToday = habit.completed_at
        ? new Date(habit.completed_at).toDateString() === new Date().toDateString()
        : false;

      // Determine the action to send to the API.
      const action = isCompletedToday ? "uncomplete" : "complete";

      const response = await fetch(`/api/habits?id=${habitId}&action=${action}`, {
        method: "PATCH",
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update the specific habit in state.
        setHabits(habits.map((h) => (h.id === habitId ? data.habit : h)));
      } else {
        setError(data.error || `Failed to ${action} habit`);
      }
    } catch (err) {
      setError("An error occurred while toggling habit completion");
      console.error(err);
    }
  };

  // Delete a habit.
  const deleteHabit = async (habitId) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    
    try {
      const response = await fetch(`/api/habits?id=${habitId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setHabits(habits.filter((habit) => habit.id !== habitId));
      } else {
        setError(data.error || "Failed to delete habit");
      }
    } catch (err) {
      setError("An error occurred while deleting habit");
      console.error(err);
    }
  };

  return (
    <div className="col-span-4">
      <h2 className="font-medium text-lg mb-3">Habits</h2>
      
      {isAddingHabit ? (
        <form onSubmit={handleAddHabit} className="mb-3">
          <div className="flex gap-2">
            <Input
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="New habit name"
              className="flex-grow"
              autoFocus
            />
            <Button type="submit" variant="default" className="bg-emerald-500 hover:bg-emerald-600">
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingHabit(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Card
          className="bg-gray-100 mb-3 shadow-none hover:bg-gray-200 cursor-pointer"
          onClick={() => setIsAddingHabit(true)}
        >
          <CardContent className="p-4 text-gray-500 flex items-center">
            <Plus size={16} className="mr-2" />
            Add a Habit
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm p-2">{error}</div>
        ) : habits.length === 0 ? (
          <div className="text-gray-500 text-sm p-2">No habits yet. Add one to get started!</div>
        ) : (
          habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggleComplete={toggleHabitCompletion}
              onDelete={deleteHabit}
            />
          ))
        )}
      </div>
    </div>
  );
};
