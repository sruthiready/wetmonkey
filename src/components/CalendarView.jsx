import React, { useMemo, useState } from "react";

// Calculate start of calendar grid (the Sunday before month start)
function getCalendarStart(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = first.getDay(); // 0 = Sun
  const start = new Date(first);
  start.setDate(first.getDate() - day);
  return start;
}

export default function CalendarView({
  calendarDate,
  setCalendarDate,
  eventsByDate,
  openJob,
}) {
  const [selectedEvents, setSelectedEvents] = useState([]);

  const start = getCalendarStart(calendarDate);

  // Build the 6-week view (42 cells)
  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toDateString();
      arr.push({
        date: d,
        events: eventsByDate[key] || [],
      });
    }
    return arr;
  }, [start, eventsByDate]);

  const goNextMonth = () =>
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1)
    );

  const goPrevMonth = () =>
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1)
    );

  return (
    <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          {calendarDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {calendarDate.getFullYear()}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={goPrevMonth}
            className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            Prev
          </button>
          <button
            onClick={goNextMonth}
            className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 text-xs font-semibold text-center text-gray-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, idx) => {
          const isCurrentMonth =
            c.date.getMonth() === calendarDate.getMonth();

          return (
            <div
              key={idx}
              onClick={() => setSelectedEvents(c.events)}
              className={`p-2 min-h-[90px] border rounded cursor-pointer transition ${
                isCurrentMonth
                  ? "bg-white hover:bg-gray-50"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              <div className="text-sm font-semibold">{c.date.getDate()}</div>

              {/* Events shown as quick badges */}
              <div className="mt-2 space-y-1">
                {c.events.slice(0, 3).map((ev, i) => (
                  <div
                    key={i}
                    className={`text-xs rounded px-1 py-0.5 ${
                      ev.type === "interview"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ev.type === "interview" ? "Interview" : "Assignment"} ·{" "}
                    {ev.jobCompany}
                  </div>
                ))}
                {c.events.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{c.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Event Drawer */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Events</h3>

        {selectedEvents.length === 0 && (
          <p className="text-sm text-gray-500">
            Click a date to view interviews and assignments.
          </p>
        )}

        {selectedEvents.map((ev, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded p-3 border mb-2 flex justify-between"
          >
            <div>
              <div className="font-semibold text-gray-800">
                {ev.type === "interview" ? "Interview" : "Assignment"} —{" "}
                {ev.jobCompany}
              </div>
              <div className="text-xs text-gray-500">
                {ev.detail.title || ev.detail.role}
              </div>
            </div>

            <button
              onClick={() => openJob(ev.jobId)}
              className="text-frog-800 hover:underline text-sm"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
