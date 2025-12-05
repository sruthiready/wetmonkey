import React from "react";

export default function ResearchView({ targets, convertToJob }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {targets.map((t) => (
        <div
          key={t.id}
          className="bg-white rounded-xl p-6 shadow border border-gray-200"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t.fundName}
              </h3>

              <div className="text-xs text-purple-700 bg-purple-100 inline px-2 py-1 rounded mt-1">
                {t.stage}
              </div>
            </div>

            <div className="text-xs text-gray-400">
              {new Date(t.dates.added).toLocaleDateString()}
            </div>
          </div>

          {/* Focus */}
          <p className="text-sm text-gray-700 mt-3">
            {t.focus || "No focus description."}
          </p>

          {/* Notes */}
          <p className="text-sm text-gray-500 mt-3 min-h-[40px] whitespace-pre-wrap">
            {t.researchNotes || "No notes yet."}
          </p>

          {/* Convert to job */}
          <div className="mt-5 text-right">
            <button
              onClick={() => convertToJob(t)}
              className="bg-frog-900 text-white px-4 py-2 rounded hover:bg-frog-800"
            >
              Convert to Job
            </button>
          </div>
        </div>
      ))}

      {targets.length === 0 && (
        <div className="text-gray-600 text-center col-span-full p-8">
          No research targets yet. Add your first target from the dashboard.
        </div>
      )}
    </div>
  );
}
