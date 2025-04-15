"use client";
import { useState, useRef, useEffect } from "react";

// -------------------------
// Data & Utility Functions
// -------------------------

// Fixed waypoints positions (first four will be used for weeks)
const waypoints = [
  { id: 1, top: "85%", left: "70%" },
  { id: 2, top: "70%", left: "60%" },
  { id: 3, top: "55%", left: "75%" },
  { id: 4, top: "48%", left: "62%" },
  // The flag stays separate
  { id: "flag", top: "37%", left: "72%", isFlag: true },
];

// Simple CSS flag (can be replaced with an image or SVG)
function FlagIcon() {
  return (
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderBottom: "20px solid red",
      }}
    />
  );
}

// Parse the generated roadmap text into an array of week objects.
// Expected text format example:
//
// ### Week 1: [Brief Focus Area]
// **Initial Setup**
// - Install development environment
// - Configure tools
// - Review basic concepts
//
// **Fundamental Concepts**
// - Watch introductory videos
// - Complete basic tutorials
// - Take initial notes
//
// (and so on for Week 2, Week 3, Week 4)
function parseRoadmap(text) {
  const weekBlocks = text.split("###").filter((block) => block.trim());
  const weeks = weekBlocks.map((block) => {
    const lines = block.trim().split("\n").map((line) => line.trim());
    const header = lines.shift(); // first line is the week header
    const sections = [];
    let currentSection = null;
    lines.forEach((line) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: line.replace(/\*\*/g, "").trim(), tasks: [] };
      } else if (line.startsWith("-")) {
        if (currentSection) {
          const taskLine = line.slice(1).trim();
          if (taskLine) currentSection.tasks.push(taskLine);
        }
      }
    });
    if (currentSection) sections.push(currentSection);
    return { week: header, sections };
  });
  return weeks;
}

// -------------------------
// UI Components
// -------------------------

// SectionBox renders an individual section and its tasks inside a waypoint.
// Clicking the section toggles the display of its subtasks.
function SectionBox({ section }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(!expanded);
      }}
      className="border rounded p-2 bg-white mt-2 cursor-pointer"
    >
      <div className="font-bold">{section.title}</div>
      {expanded && (
        <ul className="mt-1 ml-4 list-disc">
          {section.tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// WaypointBox renders a single waypoint box.
// For regular waypoints, if roadmap data is provided, it displays the week title.
// When clicked, it expands to reveal the inner sections.
function WaypointBox({ wp, index, roadmapData }) {
  const [expanded, setExpanded] = useState(false);
  // For non-flag waypoints, if roadmap data is available, show the week header.
  const label =
    roadmapData && roadmapData[index] ? roadmapData[index].week : `Box ${wp.id}`;
  const weekData = roadmapData ? roadmapData[index] : null;

  return (
    <div
      className="absolute bg-white border border-gray-400 text-xs flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
      style={{
        top: wp.top,
        left: wp.left,
        width: wp.isFlag ? "20px" : "60px",
        height: wp.isFlag ? "20px" : "30px",
        transformOrigin: "center",
        zIndex: 10,
      }}
      // Only allow expansion for non-flag waypoints
      onClick={(e) => {
        e.stopPropagation();
        if (!wp.isFlag) setExpanded(!expanded);
      }}
    >
      {wp.isFlag ? <FlagIcon /> : <div className="p-1 text-center">{label}</div>}
      {expanded && weekData && (
        <div className="mt-2 p-2 bg-gray-100 rounded shadow-lg">
          {weekData.sections.map((section, i) => (
            <SectionBox key={i} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}

// InteractiveRoadmap renders all the waypoints and draws the dotted connecting lines.
function InteractiveRoadmap({ roadmapData }) {
  const containerRef = useRef(null);
  const [waypointCoords, setWaypointCoords] = useState([]);
  const [flagCoord, setFlagCoord] = useState(null);

  useEffect(() => {
    const measureBoxes = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      // Measure regular waypoint boxes (using the data-type attribute)
      const waypointElements = containerRef.current.querySelectorAll(
        "[data-type='waypoint']"
      );
      const newCoords = [];
      waypointElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - containerRect.left;
        const y = rect.top + rect.height / 2 - containerRect.top;
        newCoords.push({ x, y });
      });
      setWaypointCoords(newCoords);

      // Measure the flag box
      const flagEl = containerRef.current.querySelector("[data-type='flag']");
      if (flagEl) {
        const rect = flagEl.getBoundingClientRect();
        const coord = {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
        setFlagCoord(coord);
      }
    };

    measureBoxes();
    window.addEventListener("resize", measureBoxes);
    return () => window.removeEventListener("resize", measureBoxes);
  }, []);

  // Create polyline points to connect the regular waypoints.
  const waypointPoints = waypointCoords.map((c) => `${c.x},${c.y}`).join(" ");
  const lastWaypoint = waypointCoords[waypointCoords.length - 1];

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* SVG layer to draw the dotted connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {waypointCoords.length > 0 && (
          <polyline
            points={waypointPoints}
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        )}
        {lastWaypoint && flagCoord && (
          <line
            x1={lastWaypoint.x}
            y1={lastWaypoint.y}
            x2={flagCoord.x}
            y2={flagCoord.y}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        )}
      </svg>

      {/* Render each waypoint */}
      {waypoints.map((wp, idx) => (
        <div data-type={wp.isFlag ? "flag" : "waypoint"} key={wp.id}>
          <WaypointBox
            wp={wp}
            index={wp.isFlag ? null : idx} // Only regular waypoints use index
            roadmapData={wp.isFlag ? null : roadmapData}
          />
        </div>
      ))}
    </div>
  );
}

// -------------------------
// Main Page Component
// -------------------------

export default function RoadmapPage() {
  // For the API-generated 4‑week roadmap
  const [task, setTask] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Submit the input to your API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const data = await response.json();
      // The API returns the generated roadmap text in data.data
      const generatedText = data.data;
      const parsed = parseRoadmap(generatedText);
      // We expect the parsed array to have at least 4 items (one per week)
      setRoadmapData(parsed);
    } catch (err) {
      console.error("Error generating roadmap:", err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background image */}
      <img
        src="png1.png"
        alt="Roadmap Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Interactive roadmap with waypoints (including generated week data) */}
      <InteractiveRoadmap roadmapData={roadmapData} />

      {/* Input form overlay (position as needed) */}
      <div className="absolute top-0 left-0 z-20 p-4 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Generate 4‑Week Roadmap</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter a task or objective"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border p-2 flex-1"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
}
