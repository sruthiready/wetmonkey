import FrogLogo from "/logo-frog.png";   // ← CORRECT for Vite
import React from "react";


export default function FrogHeader({
  frogName,
  tagline,
  currentView,
  setCurrentView,
}) {
  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "pipeline", label: "Pipeline" },
    { key: "research", label: "Research" },
    { key: "calendar", label: "Calendar" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <header className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        <img
          src={FrogLogo}
          className="w-12 h-12 rounded-full bg-frog-900 p-1 object-contain"
          alt="frog"
        />

        <div>
          <div className="text-xl font-bold text-frog-900">Moist Frog</div>
          <div className="text-sm text-frog-800 italic">{tagline}</div>
        </div>
      </div>

      {/* Right: Navigation */}
      <nav className="flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setCurrentView(t.key)}
            className={`px-3 py-2 rounded font-medium transition ${
              currentView === t.key
                ? "bg-frog-200 text-frog-900 shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}

        {/* Frog name on far right */}
        <div className="ml-4 text-sm text-frog-900 font-semibold">
          {frogName}
        </div>
      </nav>
    </header>
  );
}
