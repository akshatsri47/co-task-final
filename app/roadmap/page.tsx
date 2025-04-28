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
  { id: "flag", top: "31%", left: "72%", isFlag: true },
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
function SectionBox({ section }) {
  return (
    <div className="border-b last:border-b-0 py-2">
      <div className="font-bold">{section.title}</div>
      <ul className="mt-1 ml-4 list-disc text-xs">
        {section.tasks.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

// WaypointBox renders a single waypoint box.
function WaypointBox({ wp, index, roadmapData, selectedWaypoint, setSelectedWaypoint }) {
  const label =
    roadmapData && roadmapData[index] ? roadmapData[index].week : `Box ${wp.id}`;
  const weekData = roadmapData ? roadmapData[index] : null;
  const isSelected = selectedWaypoint === wp.id;

  return (
    <>
      <div
        className={`absolute bg-white border ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-400'} 
                    text-xs flex flex-col items-center justify-center cursor-pointer transition-all duration-300 
                    hover:scale-105 z-10`}
        style={{
          top: wp.top,
          left: wp.left,
          width: wp.isFlag ? "20px" : "60px",
          height: wp.isFlag ? "20px" : "30px",
          transformOrigin: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!wp.isFlag) {
            setSelectedWaypoint(isSelected ? null : wp.id);
          }
        }}
      >
        {wp.isFlag ? <FlagIcon /> : <div className="p-1 text-center">{label}</div>}
      </div>
    </>
  );
}

// DetailPanel shows the selected waypoint's details in a fixed panel
function DetailPanel({ selectedId, roadmapData }) {
  if (!selectedId || selectedId === "flag" || !roadmapData) return null;
  
  const weekIndex = selectedId - 1; // Convert waypoint ID to index
  const weekData = roadmapData[weekIndex];
  
  if (!weekData) return null;

  return (
    <div className="absolute top-4 right-4 w-64 bg-white shadow-lg rounded-lg p-4 z-20 border border-gray-200">
      <h2 className="text-lg font-bold mb-2">{weekData.week}</h2>
      <div className="max-h-96 overflow-y-auto">
        {weekData.sections.map((section, i) => (
          <SectionBox key={i} section={section} />
        ))}
      </div>
    </div>
  );
}

function InteractiveRoadmap({ roadmapData }) {
  const containerRef = useRef(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [waypointPositions, setWaypointPositions] = useState([]);
  const [flagPosition, setFlagPosition] = useState(null);
  
  // Calculate actual pixel positions of all waypoints
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Get container dimensions
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Calculate pixel positions for waypoints
    const positions = waypoints.map(wp => {
      if (wp.isFlag) {
        // Calculate flag position
        const flagTop = parseFloat(wp.top) / 100 * containerHeight;
        const flagLeft = parseFloat(wp.left) / 100 * containerWidth;
        setFlagPosition({ x: flagLeft, y: flagTop });
        return null;
      } else {
        // Calculate waypoint position
        const top = parseFloat(wp.top) / 100 * containerHeight;
        const left = parseFloat(wp.left) / 100 * containerWidth;
        return { id: wp.id, x: left, y: top };
      }
    }).filter(Boolean); // Remove null entries (flag)
    
    setWaypointPositions(positions);
    
    // Handle window resize
    const handleResize = () => {
      // Recalculate positions on window resize
      const newContainerWidth = container.offsetWidth;
      const newContainerHeight = container.offsetHeight;
      
      const newPositions = waypoints.map(wp => {
        if (wp.isFlag) {
          const flagTop = parseFloat(wp.top) / 100 * newContainerHeight;
          const flagLeft = parseFloat(wp.left) / 100 * newContainerWidth;
          setFlagPosition({ x: flagLeft, y: flagTop });
          return null;
        } else {
          const top = parseFloat(wp.top) / 100 * newContainerHeight;
          const left = parseFloat(wp.left) / 100 * newContainerWidth;
          return { id: wp.id, x: left, y: top };
        }
      }).filter(Boolean);
      
      setWaypointPositions(newPositions);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close detail panel when clicking anywhere on the container
  const handleContainerClick = () => {
    setSelectedWaypoint(null);
  };

  // Create SVG paths between waypoints
  const renderPaths = () => {
    if (waypointPositions.length === 0 || !flagPosition) return null;
    
    // Connect dots between waypoints
    const pathElements = [];
    
    // Create paths between waypoints
    for (let i = 0; i < waypointPositions.length - 1; i++) {
      const start = waypointPositions[i];
      const end = waypointPositions[i + 1];
      
      pathElements.push(
        <g key={`path-${i}`}>
          <path
            d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
            stroke="#000000"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="none"
          />
          {/* Dot at the start point */}
          <circle
            cx={start.x}
            cy={start.y}
            r="4"
            fill={selectedWaypoint === start.id ? "#3B82F6" : "#000000"}
          />
          {/* Arrow between points */}
          <marker
            id={`arrow-${i}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#000000" />
          </marker>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#000000"
            strokeWidth="2"
            markerEnd={`url(#arrow-${i})`}
            style={{ opacity: 0.5 }}
          />
        </g>
      );
    }
    
    // Add path to flag
    const lastWaypoint = waypointPositions[waypointPositions.length - 1];
    
    pathElements.push(
      <g key="path-to-flag">
        <path
          d={`M ${lastWaypoint.x} ${lastWaypoint.y} L ${flagPosition.x} ${flagPosition.y}`}
          stroke="#000000"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
        />
        {/* Dot at the last waypoint */}
        <circle
          cx={lastWaypoint.x}
          cy={lastWaypoint.y}
          r="4"
          fill={selectedWaypoint === lastWaypoint.id ? "#3B82F6" : "#000000"}
        />
        {/* Flag dot */}
        <circle
          cx={flagPosition.x}
          cy={flagPosition.y}
          r="4"
          fill="#FF0000"
        />
        {/* Arrow to flag */}
        <marker
          id="arrow-to-flag"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#000000" />
        </marker>
        <line
          x1={lastWaypoint.x}
          y1={lastWaypoint.y}
          x2={flagPosition.x}
          y2={flagPosition.y}
          stroke="#000000"
          strokeWidth="2"
          markerEnd="url(#arrow-to-flag)"
          style={{ opacity: 0.5 }}
        />
      </g>
    );
    
    return pathElements;
  };

  return (
    <div ref={containerRef} className="absolute inset-0" onClick={handleContainerClick}>
      {/* SVG layer for paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        {renderPaths()}
      </svg>

      {/* Render each waypoint */}
      {waypoints.map((wp, idx) => (
        <div key={wp.id}>
          <WaypointBox
            wp={wp}
            index={wp.isFlag ? null : idx}
            roadmapData={wp.isFlag ? null : roadmapData}
            selectedWaypoint={selectedWaypoint}
            setSelectedWaypoint={setSelectedWaypoint}
          />
        </div>
      ))}

      {/* Detail panel for selected waypoint */}
      <DetailPanel 
        selectedId={selectedWaypoint} 
        roadmapData={roadmapData} 
      />
    </div>
  );
}

// -------------------------
// Main Page Component
// -------------------------

export default function RoadmapPage() {
  // For the API-generated 4-week roadmap
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
        <h1 className="text-2xl font-bold mb-4">Generate 4-Week Roadmap</h1>
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