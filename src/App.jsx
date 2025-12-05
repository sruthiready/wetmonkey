import React, { useEffect, useMemo, useState } from "react";
import FrogHeader from "./components/FrogHeader";
import DashboardView from "./components/DashboardView";
import PipelineView from "./components/PipelineView";
import ResearchView from "./components/ResearchView";
import CalendarView from "./components/CalendarView";
import SettingsView from "./components/SettingsView";

import {
  save as saveStorage,
  load as loadStorage,
} from "./service/storage";
import { useScheduler } from "./hooks/useScheduler";

const TAGLINES = [
  "Your job search companion",
  "Leap into your next opportunity",
  "Never let your opportunities dry up",
  "Keeping your job search alive and kicking",
  "Ribbeting into your next role",
  "Think outside your pond",
  "Don't be smooth, be moist",
  "A green monkey, in disguise",
];

const APPLICATION_STAGES = [
  "Discovered",
  "Applied",
  "First Contact",
  "Assignment",
  "Interview",
  "Offer",
  "Rejected",
];

function newId() {
  return "id-" + Math.random().toString(36).slice(2, 9);
}

/* ---------- Small Inline Helpers ---------- */

function ContactAdder({ onSave }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

function openAddJob() {
  setAddType("job");
  setShowAddModal(true);
}

function openAddResearch() {
  setAddType("research");
  setShowAddModal(true);
}

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="px-2 py-1 border rounded text-sm flex-1"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        className="px-2 py-1 border rounded text-sm flex-1"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="px-2 py-1 border rounded text-sm flex-1"
      />
      <button
        onClick={() => {
          if (!name) return;
          onSave({ name, role, email });
          setName("");
          setRole("");
          setEmail("");
        }}
        className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
      >
        Add
      </button>
    </div>
  );
}

function InterviewAdder({ onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [interviewer, setInterviewer] = useState("");

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Round (e.g. Case, HR)"
        className="px-2 py-1 border rounded text-sm flex-1"
      />
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="datetime-local"
        className="px-2 py-1 border rounded text-sm"
      />
      <input
        value={interviewer}
        onChange={(e) => setInterviewer(e.target.value)}
        placeholder="Interviewer"
        className="px-2 py-1 border rounded text-sm flex-1"
      />
      <button
        onClick={() => {
          if (!date) return;
          onSave({ title, date, interviewer });
          setTitle("");
          setDate("");
          setInterviewer("");
        }}
        className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
      >
        Add
      </button>
    </div>
  );
}

function AssignmentAdder({ onSave }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Assignment title"
        className="px-2 py-1 border rounded text-sm flex-1"
      />
      <input
        value={due}
        onChange={(e) => setDue(e.target.value)}
        type="datetime-local"
        className="px-2 py-1 border rounded text-sm"
      />
      <button
        onClick={() => {
          if (!title || !due) return;
          onSave({ title, dueDate: due });
          setTitle("");
          setDue("");
        }}
        className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
      >
        Add
      </button>
    </div>
  );
}

/* ---------- Add Job Modal ---------- */

function AddJobModal({ onClose, onSave }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [priority, setPriority] = useState("low");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-[fadeIn_0.15s_ease-out]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New Application
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 px-3 py-2 border rounded w-full text-sm"
              placeholder="Moist Frog Capital"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 px-3 py-2 border rounded w-full text-sm"
              placeholder="Analyst / Associate / etc."
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 px-3 py-2 border rounded w-full text-sm"
            >
              <option value="low">Low – nice to have</option>
              <option value="medium">Medium – solid</option>
              <option value="high">High – dream pond</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!company) return;
              onSave({ company, role, priority });
              onClose();
            }}
            className="px-4 py-2 rounded bg-frog-900 text-white text-sm hover:bg-frog-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Add Research Modal ---------- */

function AddResearchModal({ onClose, onSave }) {
  const [fundName, setFundName] = useState("");
  const [focus, setFocus] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Research Target
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Fund / Company</label>
            <input
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
              className="mt-1 px-3 py-2 border rounded w-full text-sm"
              placeholder="Green Pond Ventures"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Focus / Theme</label>
            <input
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="mt-1 px-3 py-2 border rounded w-full text-sm"
              placeholder="Early-stage SaaS, infra, etc."
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 px-3 py-2 border rounded w-full text-sm min-h-[80px]"
              placeholder="Why is this interesting? Warm intros, thesis, etc."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!fundName) return;
              onSave({ fundName, focus, researchNotes: notes });
              onClose();
            }}
            className="px-4 py-2 rounded bg-purple-600 text-white text-sm hover:bg-purple-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Job Detail Modal ---------- */

function JobModal({
  job,
  onClose,
  onUpdateJob,
  onDeleteJob,
  onAddContact,
  onAddInterview,
  onAddAssignment,
}) {
  const [notes, setNotes] = useState(job.notes || "");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-auto border border-frog-200">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {job.company} — {job.role}
            </h3>
            <div className="text-xs text-gray-500 mt-1">
              Stage:{" "}
              <span className="font-semibold text-frog-900">
                {job.stage}
              </span>{" "}
              • Priority:{" "}
              <span className="font-semibold">
                {job.priority?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Delete this job from your pond? This cannot be undone."
                  )
                ) {
                  onDeleteJob(job.id);
                }
              }}
              className="px-3 py-1.5 text-sm rounded border border-red-500 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Stage changer */}
        <div className="mb-4">
          <label className="text-xs text-gray-600 mr-2">Change Stage:</label>
          <select
            value={job.stage}
            onChange={(e) => onUpdateJob({ ...job, stage: e.target.value })}
            className="px-2 py-1 border rounded text-xs"
          >
            {APPLICATION_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Layout grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Left: Notes */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Notes & Thoughts
            </h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm min-h-[140px]"
              placeholder="Interview prep notes, feedback, thesis, red flags, etc."
            />
            <button
              onClick={() => onUpdateJob({ ...job, notes })}
              className="mt-2 px-3 py-1.5 bg-emerald-600 text-white rounded text-sm"
            >
              Save Notes
            </button>
          </div>

          {/* Right: Meta info */}
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-500">Discovered</div>
              <div>
                {job.dates?.discovered
                  ? new Date(job.dates.discovered).toLocaleDateString()
                  : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Applied</div>
              <div>
                {job.dates?.applied
                  ? new Date(job.dates.applied).toLocaleDateString()
                  : "Not applied yet"}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Contacts */}
        <section className="mb-4">
          <h4 className="font-semibold text-gray-800">Contacts</h4>
          <div className="mt-2 space-y-2">
            {(job.contacts || []).map((c) => (
              <div
                key={c.id}
                className="bg-gray-50 border rounded p-2 text-sm flex justify-between"
              >
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.role} • {c.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ContactAdder
            onSave={(contact) => onAddContact(job.id, contact)}
          />
        </section>

        {/* Interviews */}
        <section className="mb-4">
          <h4 className="font-semibold text-gray-800">Interviews</h4>
          <div className="mt-2 space-y-2">
            {(job.interviews || []).map((i) => (
              <div
                key={i.id}
                className="bg-emerald-50 border border-emerald-100 rounded p-2 text-sm"
              >
                <div className="font-semibold">
                  {i.title || i.type || "Interview"}
                </div>
                <div className="text-xs text-gray-600">
                  {i.date ? new Date(i.date).toLocaleString() : "No date"}{" "}
                  {i.interviewer ? `• ${i.interviewer}` : ""}
                </div>
              </div>
            ))}
          </div>
          <InterviewAdder
            onSave={(iv) => onAddInterview(job.id, iv)}
          />
        </section>

        {/* Assignments */}
        <section>
          <h4 className="font-semibold text-gray-800">Assignments</h4>
          <div className="mt-2 space-y-2">
            {(job.assignments || []).map((a) => (
              <div
                key={a.id}
                className="bg-yellow-50 border border-yellow-100 rounded p-2 text-sm"
              >
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-gray-600">
                  Due{" "}
                  {a.dueDate
                    ? new Date(a.dueDate).toLocaleString()
                    : "—"}{" "}
                  • {a.status || "not_started"}
                </div>
              </div>
            ))}
          </div>
          <AssignmentAdder
            onSave={(as) => onAddAssignment(job.id, as)}
          />
        </section>
      </div>
    </div>
  );
}

/* ---------- MAIN APP ---------- */

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [tagline, setTagline] = useState("");
  const [frogName, setFrogName] = useState("Moist");
  const [userEmail, setUserEmail] = useState(""); // You can hardcode yours here if you like
  const [jobs, setJobs] = useState([]);
  const [researchTargets, setResearchTargets] = useState([]);
  const [filterPriority, setFilterPriority] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState("job");
  const [selectedJob, setSelectedJob] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Initial load
  useEffect(() => {
    setTagline(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);

    (async () => {
      const u = await loadStorage("user");
      if (u) {
        setFrogName(u.frogName || "Moist");
        setUserEmail(u.email || "");
      }

      const js = await loadStorage("jobs");
      if (js) setJobs(js);

      const rs = await loadStorage("research");
      if (rs) setResearchTargets(rs);
    })();
  }, []);

  const persistJobs = async (j) => {
    setJobs(j);
    await saveStorage("jobs", j);
  };

  const persistResearch = async (r) => {
    setResearchTargets(r);
    await saveStorage("research", r);
  };

  const persistUser = async (u) => {
    await saveStorage("user", u);
  };

  // Compute reminders
  const computeReminders = () => {
    const now = new Date();
    const all = [];

    jobs.forEach((job) => {
      // Discovered → nudge to apply
      if (job.stage === "Discovered") {
        const disc = new Date(job.dates.discovered);
        const hours = (now - disc) / (1000 * 60 * 60);
        if (hours >= 48) {
          all.push({
            priority: job.priority || "low",
            message: "Move to Application stage (48hrs elapsed)",
            job,
          });
        }
      }

      // Applied → follow-up cadence
      if (job.stage === "Applied" && job.dates?.applied) {
        const applied = new Date(job.dates.applied);
        const days = (now - applied) / (1000 * 60 * 60 * 24);
        if (days >= 7 && days < 28) {
          all.push({
            priority: job.priority || "low",
            message: "Follow up needed (1 week since applied)",
            job,
          });
        } else if (days >= 28) {
          all.push({
            priority: "low",
            message: "Consider moving on (4 weeks)",
            job,
          });
        }
      }

      // Interviews → prep reminders
      (job.interviews || []).forEach((i) => {
        if (i.date) {
          const intDate = new Date(i.date);
          const daysDiff = (intDate - now) / (1000 * 60 * 60 * 24);
          if (daysDiff <= 2 && daysDiff >= 0) {
            all.push({
              priority: "high",
              message: `Prep needed: Interview on ${intDate.toLocaleString()}`,
              job,
            });
          }
        }
      });

      // Assignments → due in <24h
      (job.assignments || []).forEach((a) => {
        if (a.dueDate) {
          const due = new Date(a.dueDate);
          const hoursDiff = (due - now) / (1000 * 60 * 60);
          if (hoursDiff <= 24 && hoursDiff >= 0) {
            all.push({
              priority: "high",
              message: `Assignment due soon: ${a.title}`,
              job,
            });
          }
        }
      });
    });

    // Research reminders
    researchTargets.forEach((t) => {
      if (["Research", "Internal Assessment"].includes(t.stage)) {
        const last = new Date(t.dates.lastUpdated || t.dates.added);
        const weeks = Math.floor(
          (now - last) / (1000 * 60 * 60 * 24 * 7)
        );
        if (weeks >= 1 && weeks < 5) {
          all.push({
            priority: "low",
            message: `Week ${weeks}: Continue research?`,
            target: t,
          });
        } else if (weeks >= 5) {
          all.push({
            priority: "medium",
            message: "Week 5 — decision time: move forward or drop?",
            target: t,
          });
        }
      }

      if (t.stage === "Outreach Sent" && t.dates?.outreachSent) {
        const sent = new Date(t.dates.outreachSent);
        const days = (now - sent) / (1000 * 60 * 60 * 24);
        if (days >= 14 && days < 28) {
          all.push({
            priority: "medium",
            message: "Follow up on outreach (2 weeks)",
            target: t,
          });
        } else if (days >= 28) {
          all.push({
            priority: "low",
            message: "Final follow-up or move on (4 weeks)",
            target: t,
          });
        }
      }
    });

    const order = { high: 0, medium: 1, low: 2 };
    return all.sort((a, b) => order[a.priority] - order[b.priority]);
  };

  const reminders = computeReminders();

  // Scheduler hooks callbacks
  const getReminders = async () => reminders;

  const getTodayInterviews = async () => {
    const now = new Date();
    const out = [];
    jobs.forEach((j) =>
      (j.interviews || []).forEach((i) => {
        if (i.date) {
          const d = new Date(i.date);
          if (d.toDateString() === now.toDateString()) {
            out.push({ ...i, company: j.company });
          }
        }
      })
    );
    return out;
  };

  const getOverdueAssignments = async () => {
    const now = new Date();
    const out = [];
    jobs.forEach((j) =>
      (j.assignments || []).forEach((a) => {
        if (a.dueDate) {
          const d = new Date(a.dueDate);
          const hoursDiff = (d - now) / (1000 * 60 * 60);
          if (hoursDiff <= 24 && hoursDiff >= 0) {
            out.push({ ...a, company: j.company });
          }
        }
      })
    );
    return out;
  };

  const getWeeklySummary = async () => {
    const now = new Date();
    const inNext7Days = (dateStr) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      const diff = (d - now) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    };

    const interviewsThisWeek = jobs.reduce(
      (acc, j) =>
        acc +
        (j.interviews || []).filter((i) => inNext7Days(i.date)).length,
      0
    );

    return `Active: ${jobs.length}
Interviews this week: ${interviewsThisWeek}
Research targets: ${researchTargets.length}`;
  };

  const { sendDaily, sendWeekly } = useScheduler({
    getReminders,
    getTodayInterviews,
    getOverdueAssignments,
    getWeeklySummary,
    frogName,
    userEmail,
  });

  // Calendar events map
  const eventsByDate = useMemo(() => {
    const m = {};
    jobs.forEach((j) => {
      (j.interviews || []).forEach((i) => {
        if (i.date) {
          const key = new Date(i.date).toDateString();
          m[key] = m[key] || [];
          m[key].push({
            type: "interview",
            jobId: j.id,
            jobCompany: j.company,
            detail: i,
          });
        }
      });

      (j.assignments || []).forEach((a) => {
        if (a.dueDate) {
          const key = new Date(a.dueDate).toDateString();
          m[key] = m[key] || [];
          m[key].push({
            type: "assignment",
            jobId: j.id,
            jobCompany: j.company,
            detail: a,
          });
        }
      });
    });
    return m;
  }, [jobs]);

  // CRUD helpers
  const addJob = async (payload) => {
    const j = {
      id: newId(),
      company: payload.company || "Untitled",
      role: payload.role || "",
      priority: payload.priority || "low",
      stage: payload.stage || "Discovered",
      dates: {
        discovered: payload.dates?.discovered || new Date().toISOString(),
        applied: payload.dates?.applied || null,
      },
      notes: payload.notes || "",
      contacts: payload.contacts || [],
      interviews: payload.interviews || [],
      assignments: payload.assignments || [],
    };
    const updated = [j, ...jobs];
    await persistJobs(updated);
  };

  const addResearch = async (payload) => {
    const r = {
      id: newId(),
      fundName: payload.fundName || "Untitled",
      focus: payload.focus || "",
      stage: payload.stage || "Discovery",
      researchNotes: payload.researchNotes || "",
      dates: {
        added: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      targetContacts: payload.targetContacts || [],
    };
    const updated = [r, ...researchTargets];
    await persistResearch(updated);
  };

  const convertResearchToJob = async (t) => {
    await addJob({
      company: t.fundName,
      role: "Outreach",
      priority: "low",
      stage: "Discovered",
      dates: { discovered: new Date().toISOString() },
      notes: `Converted from research: ${t.researchNotes || ""}`,
    });
  };

  const updateJob = async (patched) => {
    const updated = jobs.map((j) => (j.id === patched.id ? patched : j));
    await persistJobs(updated);
    setSelectedJob(patched);
  };

  const deleteJob = async (id) => {
    const updated = jobs.filter((j) => j.id !== id);
    await persistJobs(updated);
    setSelectedJob(null);
  };

  const addContactToJob = async (jobId, contact) => {
    const j = jobs.find((x) => x.id === jobId);
    if (!j) return;
    j.contacts = [...(j.contacts || []), { id: newId(), ...contact }];
    await updateJob({ ...j });
  };

  const addInterviewToJob = async (jobId, interview) => {
    const j = jobs.find((x) => x.id === jobId);
    if (!j) return;
    j.interviews = [...(j.interviews || []), { id: newId(), ...interview }];
    await updateJob({ ...j });
  };

  const addAssignmentToJob = async (jobId, assignment) => {
    const j = jobs.find((x) => x.id === jobId);
    if (!j) return;
    j.assignments = [
      ...(j.assignments || []),
      { id: newId(), status: "not_started", ...assignment },
    ];
    await updateJob({ ...j });
  };

  // Drag and drop pipeline
  const handleDragEnd = async (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const dest = destination.droppableId;
    const job = jobs.find((j) => j.id === draggableId);
    if (!job) return;
    const patched = { ...job, stage: dest };
    await updateJob(patched);
  };

  // View + modal controls
  const openAddModal = (type = "job") => {
    setAddType(type);
    setShowAddModal(true);
  };

  const closeAddModal = () => setShowAddModal(false);

  const openJob = (jobOrId) => {
    if (!jobOrId) return;
    if (typeof jobOrId === "string") {
      const found = jobs.find((j) => j.id === jobOrId);
      if (found) setSelectedJob(found);
    } else {
      setSelectedJob(jobOrId);
    }
  };

  const closeJob = () => setSelectedJob(null);

  const activeCount = jobs.filter(
    (j) => !["Rejected", "Offer"].includes(j.stage)
  ).length;

  const interviewsThisWeek = (() => {
    const now = new Date();
    const inNext7Days = (dateStr) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      const diff = (d - now) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    };
    return jobs.reduce(
      (acc, j) =>
        acc +
        (j.interviews || []).filter((i) => inNext7Days(i.date)).length,
      0
    );
  })();

  // Persist user (name + email) whenever changed
  useEffect(() => {
    persistUser({ frogName, email: userEmail });
  }, [frogName, userEmail]);

  return (
    <div className="min-h-screen p-6 bg-frog-100">
      <FrogHeader
        frogName={frogName}
        tagline={tagline}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main className="mt-4 space-y-4">
        {currentView === "dashboard" && (
  <DashboardView
    reminders={reminders}

    activeJobsCount={jobs.length}

    interviewsThisWeek={
      jobs.filter(j =>
        (j.interviews || []).some(i => {
          const date = new Date(i.date);
          const now = new Date();
          const diff = (date - now) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 7; // in next 7 days
        })
      ).length
    }

    researchCount={researchTargets.length}

    onAddJob={() => openAddModal("job")}
    onAddResearch={() => openAddModal("research")}
  />
)}

        {currentView === "pipeline" && (
          <PipelineView
            jobs={jobs}
            stages={APPLICATION_STAGES}
            onDragEnd={handleDragEnd}
            openJob={openJob}
            filterPriority={filterPriority}
          />
        )}

        {currentView === "research" && (
          <ResearchView
            targets={researchTargets}
            convertToJob={convertResearchToJob}
          />
        )}

        {currentView === "calendar" && (
          <CalendarView
            calendarDate={calendarDate}
            setCalendarDate={setCalendarDate}
            eventsByDate={eventsByDate}
            openJob={(id) => openJob(id)}
          />
        )}

        {currentView === "settings" && (
          <SettingsView
            frogName={frogName}
            userEmail={userEmail}
            setFrogName={setFrogName}
            schedulerSendDaily={sendDaily}
            schedulerSendWeekly={sendWeekly}
          />
        )}
      </main>

      {/* Add modals */}
      {showAddModal && (
        <>
          {addType === "job" ? (
            <AddJobModal onClose={closeAddModal} onSave={addJob} />
          ) : (
            <AddResearchModal onClose={closeAddModal} onSave={addResearch} />
          )}
        </>
      )}

      {/* Job detail modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={closeJob}
          onUpdateJob={updateJob}
          onDeleteJob={deleteJob}
          onAddContact={addContactToJob}
          onAddInterview={addInterviewToJob}
          onAddAssignment={addAssignmentToJob}
        />
      )}
    </div>
  );
}
