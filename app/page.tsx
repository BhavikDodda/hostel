'use client';

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [rooms, setRooms] = useState(0);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [roomAllotments, setRoomAllotments] = useState<number[]>([]);
  const [graph, setGraph] = useState<{ from: number; to: number | undefined }[]>([]);
  const [output, setOutput] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [oldcost, setoldcost] = useState(0);
  const [newcost, setnewcost] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("dark"); // Apply the "dark" class on initial load
  }, []);

  const handleAddPreference = () => {
    setPreferences([...preferences, ""]);
    setRoomAllotments([...roomAllotments, 0]); // Add a default room allotment
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
          roomAllot: roomAllotments, // Include room allotments in the API call
        }),
      });
      console.log(response)
      
      const { allocation, oldcost, newcost } = await response.json();
      console.log(allocation)
      setOutput(allocation);
      setnewcost(newcost);
      setoldcost(oldcost);
    } catch (error) {
      console.error("Error fetching TTC results:", error);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-4">Top Trading Cycle Visualization</h1>

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
          value={rooms}
          onChange={(e) => setRooms(Number(e.target.value))}
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

      <div className="my-8">
        <h2 className="text-xl font-bold mb-4">Output</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          {output ? <pre>{JSON.stringify(output, null, 2)+'\nOld Cost before TTC: '+oldcost+'\nNew Cost after TTC: '+newcost}</pre> : <p>No results yet</p>}
        </div>
      </div>
    </div>
  );
}
