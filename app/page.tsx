'use client';

import { useState, useEffect } from "react";
import GraphVisualization from "@/components/GraphVisualization";


export default function Home() {
  const [rooms, setRooms] = useState(1);
  const [preferences, setPreferences] = useState<string[]>([""]);
  const [roomAllotments, setRoomAllotments] = useState<number[]>([0]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [output, setOutput] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [oldcost, setoldcost] = useState(0);
  const [newcost, setnewcost] = useState(0);
  const [completeGraphData, setCompleteGraphData] = useState<any[]>([]);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);


  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);


  useEffect(() => {
    if (completeGraphData.length > 0) {
      setGraphData(completeGraphData[currentGraphIndex]);
    }
  }, [currentGraphIndex, completeGraphData]);

  const handleRoomsChange = (value: string) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      const newRoomCount = value === "" ? 0 : Number(value);
      setRooms(newRoomCount);
  
      if (newRoomCount > preferences.length) {
        const newEntries = newRoomCount - preferences.length;
        setPreferences([...preferences, ...Array(newEntries).fill("")]);
        setRoomAllotments([...roomAllotments, ...Array(newEntries).fill(0)]);
      } else if (newRoomCount < preferences.length) {
        setPreferences(preferences.slice(0, newRoomCount));
        setRoomAllotments(roomAllotments.slice(0, newRoomCount));
      }
    }
  };
  
  const handleRoomsBlur = () => {
    if (rooms < 1) {
      setRooms(1);
      if (preferences.length < 1) {
        setPreferences([""]);
        setRoomAllotments([0]);
      }
    }
  };
  

  const handleAddPreference = () => {
    setPreferences([...preferences, ""]);
    setRoomAllotments([...roomAllotments, 0]);
    const newRoomCount = rooms+1;
    setRooms(newRoomCount);
  };

  const handlePreferenceChange = (index: number, value: string) => {
    const updatedPreferences = [...preferences];
    updatedPreferences[index] = value;
    setPreferences(updatedPreferences);
  };

  const handleRoomAllotmentChange = (index: number, value: string) => {
    const updatedAllotments = [...roomAllotments];
    updatedAllotments[index] = parseInt(value.trim(), 10) || 0;
    setRoomAllotments(updatedAllotments);
  };

  const handleNextGraph = () => {
    if (currentGraphIndex < completeGraphData.length - 1) {
      setCurrentGraphIndex(currentGraphIndex + 1);
    }
  };
  
  const handlePreviousGraph = () => {
    if (currentGraphIndex > 0) {
      setCurrentGraphIndex(currentGraphIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const parsedPreferences = preferences.map((p) =>
      p.split(",").map((s) => parseInt(s.trim()))
    );

    try {
      const isLocal = window.location.hostname === "localhost";
      const API_BASE = isLocal 
        ? "http://localhost:5000/api" 
        : "https://hostelroom-allotment.vercel.app/api";
      const response = await fetch(`/api/run-ttc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rooms,
          preferences: parsedPreferences,
          roomAllot: roomAllotments,
        }),
      });
      console.log(response)
      
      const { allocation, oldcost, newcost, completeGraphData } = await response.json();
      setOutput(allocation);
      setnewcost(newcost);
      setoldcost(oldcost);
      console.log(completeGraphData)
      setCompleteGraphData(completeGraphData);
      setCurrentGraphIndex(0);
    } catch (error) {
      console.error("Error fetching TTC results:", error);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const randomRoomAllot = () => {
    if (rooms > 0) {
      const shuffledRooms = Array.from({ length: rooms }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      setRoomAllotments(shuffledRooms);
    }
  };

  const randomPreferences = () => {
    const newPreferences = Array.from({ length: rooms }, () => {
      const randomPrefs = Array.from({ length: rooms }, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, rooms)
        .join(",");
      return randomPrefs;
    });
    setPreferences(newPreferences);
  };

  return (
  
    
     

    <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex items-center mb-4">
        {/* Logo Image */}
        {darkMode?<img src="/logodark2.png" alt="Logo" className="h-12 w-12 mr-2" />:<img src="/logo.png" alt="Logo" className="h-12 w-12 mr-2" />}

        {/* Title */}
        <h1 className="text-3xl font-bold">Top Trading Cycle Visualization</h1>
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-2 rounded z-50"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="mb-4">
        <label className="block mb-1">Number of Rooms:</label>
        <input
          type="number"
          value={rooms === 0 ? "" : rooms}
          onChange={(e) => handleRoomsChange(e.target.value)}
          onBlur={handleRoomsBlur}
          className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleAddPreference}
          className="bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-700 dark:text-white"
        >
          Add Person Preference
        </button>
        {preferences.map((pref, index) => (
          <div key={index} className="my-2 flex items-center gap-4">
            <div>
              <label className="block mb-1">Room Allotment (Person {index + 1}):</label>
              <input
                type="number"
                value={roomAllotments[index]}
                onChange={(e) => handleRoomAllotmentChange(index, e.target.value)}
                className="border p-2 rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Person {index + 1} Preferences:</label>
              <input
                type="text"
                value={pref}
                onChange={(e) => handlePreferenceChange(index, e.target.value)}
                className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded dark:bg-green-700 dark:text-white"
      >
        Run TTC
      </button>

      <div className="mt-4">
        <button
          onClick={randomRoomAllot}
          className="bg-purple-500 text-white px-4 py-2 rounded dark:bg-purple-700 dark:text-white mr-4"
        >
          Random Room Allot
        </button>
        <button
          onClick={randomPreferences}
          className="bg-yellow-500 text-white px-4 py-2 rounded dark:bg-yellow-700 dark:text-white"
        >
          Random Preferences
        </button>
      </div>

      <div className="my-8">
        <h2 className="text-xl font-bold mb-4">Graph Visualization</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <GraphVisualization graphData={graphData} />
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handlePreviousGraph}
            disabled={currentGraphIndex === 0}
            className={`px-4 py-2 mr-2 rounded ${
              currentGraphIndex === 0 ? "bg-gray-400" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextGraph}
            disabled={currentGraphIndex === completeGraphData.length - 1}
            className={`px-4 py-2 rounded ${
              currentGraphIndex === completeGraphData.length - 1 ? "bg-gray-400" : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="my-8">
        <h2 className="text-xl font-bold mb-4">Output</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          {output ? <pre>{'Rooms: People\n'+JSON.stringify(output, null, 2)+'\nOld Cost before TTC: '+oldcost+'\nNew Cost after TTC: '+newcost}</pre> : <p>No results yet</p>}
        </div>
      </div>
      <div className="my-8 text-center">
        <p className="text-sm font-light">
          Made with ❤️ by Bhavik Dodda. &copy; {new Date().getFullYear()}
        </p>
      </div>
      
    </div>
  );
}
