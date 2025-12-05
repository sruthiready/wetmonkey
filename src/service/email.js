import emailjs from "@emailjs/browser";
import { load } from "./storage";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildDailyHtml({ frogName, reminders, todayInterviews, overdueAssignments }) {
  const high = reminders.filter((r) => r.priority === "high");
  const standard = reminders.filter((r) => r.priority !== "high");

  return `
  <div style="font-family: 'Book Antiqua', Palatino, serif; color:#123;">
    <h2>🐸 ${frogName} — Daily Digest</h2>

    <h3>🔥 High Priority</h3>
    ${
      high.length
        ? "<ul>" +
          high
            .map(
              (h) =>
                `<li><strong>${h.job?.company || h.target?.fundName}</strong> — ${escapeHtml(
                  h.message
                )}</li>`
            )
            .join("") +
          "</ul>"
        : "<p>None</p>"
    }

    <h3>📌 Standard</h3>
    ${
      standard.length
        ? "<ul>" +
          standard
            .map(
              (h) =>
                `<li>${h.job?.company || h.target?.fundName} — ${escapeHtml(h.message)}</li>`
            )
            .join("") +
          "</ul>"
        : "<p>None</p>"
    }

    <h3>📅 Today’s Interviews</h3>
    ${
      todayInterviews.length
        ? "<ul>" +
          todayInterviews
            .map(
              (i) =>
                `<li>${i.company} — ${new Date(i.date).toLocaleString()}</li>`
            )
            .join("") +
          "</ul>"
        : "<p>None today</p>"
    }

    <h3>⚠️ Overdue Assignments</h3>
    ${
      overdueAssignments.length
        ? "<ul>" +
          overdueAssignments
            .map(
              (a) =>
                `<li>${a.company} — ${a.title} (due ${new Date(
                  a.dueDate
                ).toLocaleString()})</li>`
            )
            .join("") +
          "</ul>"
        : "<p>None</p>"
    }
  </div>
  `;
}

export function buildWeeklyHtml({ frogName, summary }) {
  return `
  <div style="font-family:'Book Antiqua', Palatino, serif;">
    <h2>🐸 ${frogName} — Weekly Summary</h2>
    <pre style="white-space: pre-wrap">${escapeHtml(summary)}</pre>
  </div>
  `;
}

export async function sendEmail({
  serviceId,
  templateId,
  publicKey,
  toEmail,
  subject,
  htmlBody,
  templateParams = {},
}) {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Missing EmailJS config");
  }

  const params = {
    to_email: toEmail,
    subject,
    message_html: htmlBody,
    ...templateParams,
  };

  return emailjs.send(serviceId, templateId, params, publicKey);
}

export async function loadEmailConfig() {
  return await load("email_config");
}
