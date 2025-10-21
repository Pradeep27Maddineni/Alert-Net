// src/components/InfoSidebar.jsx
import React from "react";

const crimeFacts = [
  "Every 3 minutes, a road accident occurs in India.",
  "Most thefts are reported between 6 PM and 9 PM.",
  "Cybercrime has increased 63% in the last 3 years.",
  "Fire incidents peak in summer due to short circuits.",
];

const topAreas = [
  { name: "Guntur", level: "🟠 Moderate" },
  { name: "Vijayawada", level: "🔴 High" },
  { name: "Vizag", level: "🟢 Low" },
];

const InfoSidebar = () => {
  return (
    <div className="w-full md:w-[60%] p-4 md:p-8 space-y-6">
      <div className="bg-slate-700 rounded-xl shadow-md shadow-red-500/30 p-6">
        <h3 className="text-xl font-bold text-red-400 mb-3">🧠 Did You Know?</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-100">
          {crimeFacts.map((fact, idx) => (
            <li key={idx}>{fact}</li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-700 rounded-xl shadow-md shadow-red-500/30 p-6">
        <h3 className="text-xl font-bold text-red-400 mb-3">📍 Top Reported Areas</h3>
        <ul className="space-y-2 text-sm text-gray-100">
          {topAreas.map((area, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{area.name}</span>
              <span>{area.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoSidebar;
