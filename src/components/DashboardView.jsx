import React from "react";
import FrogHeader from "../components/FrogHeader";

// -----------------------------------------------
// INLINE EMAIL SETUP CARD
// -----------------------------------------------
function EmailSetupCard() {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-gray-200 mt-10">
      <h2 className="text-xl font-bold text-frog-900 mb-2">
        🐸 Moist Frog Email Setup Guide
      </h2>

      <p className="text-gray-700 mb-4">
        To enable automatic <strong>Daily Digests</strong> and
        <strong> Weekly Summaries</strong>, Moist Frog uses EmailJS.
      </p>

      <ol className="list-decimal ml-5 text-gray-700 space-y-1 mb-4">
        <li>Create an account at <strong>EmailJS</strong>.</li>
        <li>Create an <strong>Email Service</strong> and copy <strong>Service ID</strong>.</li>
        <li>
          Create an <strong>Email Template</strong> and paste:
          <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
{`{{htmlBody}}`}
          </pre>
        </li>
        <li>Copy <strong>Template ID</strong> and <strong>Public Key</strong>.</li>
        <li>Enter them in the <strong>Settings</strong> tab.</li>
        <li>Send a test email.</li>
      </ol>

      <p className="text-gray-700 italic">
        Moist Frog will automatically send digests at 8 AM.
      </p>
    </div>
  );
}

// -----------------------------------------------
// DASHBOARD VIEW
// -----------------------------------------------
export default function DashboardView({
  frogName,
  tagline,
  stats,
  onAddJob,
  onAddResearch,
}) {
  stats = stats || { active: 0, interviews: 0, research: 0, actions: 0 };

  return (
    <div className="p-6">
     
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-frog-900">Active Applications</h3>
          <p className="text-3xl font-bold text-frog-800">{stats.active}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-frog-900">Interviews This Week</h3>
          <p className="text-3xl font-bold text-frog-800">{stats.interviews}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-frog-900">Research Targets</h3>
          <p className="text-3xl font-bold text-frog-800">{stats.research}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-frog-900">Action Items</h3>
          <p className="text-3xl font-bold text-frog-800">{stats.actions}</p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onAddJob}
          className="px-6 py-3 rounded-lg bg-frog-200 text-black font-semibold shadow hover:bg-frog-300"
        >
          + Add Job Application
        </button>

        <button
          onClick={onAddResearch}
          className="px-6 py-3 rounded-lg bg-frog-200 text-black font-semibold shadow hover:bg-frog-300"
        >
          + Add Research Target
        </button>
      </div>

      {/* EMAIL SETUP CARD */}
      <EmailSetupCard />

    </div>
  );
}
