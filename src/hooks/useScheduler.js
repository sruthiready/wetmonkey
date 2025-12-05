import { useEffect, useState } from "react";
import { load, save } from "../service/storage";   // ⬅️ correct
import {
  loadEmailConfig,
  buildDailyHtml,
  buildWeeklyHtml,
  sendEmail,
} from "../service/email";                          // ⬅️ FIXED HERE

const getTodayKey = (d) =>
  `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export function useScheduler({
  getReminders,
  getTodayInterviews,
  getOverdueAssignments,
  getWeeklySummary,
  frogName,
  userEmail,
}) {
  const [lastDailySent, setLastDailySent] = useState(null);
  const [lastWeeklySent, setLastWeeklySent] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await load("scheduler_meta");
      if (s) {
        setLastDailySent(s.lastDaily || null);
        setLastWeeklySent(s.lastWeekly || null);
      }
    })();
  }, []);

  const persist = async (meta) => {
    const prev = (await load("scheduler_meta")) || {};
    const merged = { ...prev, ...meta };
    await save("scheduler_meta", merged);
  };

  const sendDaily = async ({ force = false } = {}) => {
    const now = new Date();
    const todayKey = getTodayKey(now);

    if (!force && lastDailySent === todayKey)
      return { sent: false, reason: "already_sent" };

    const reminders = await getReminders();
    const interviews = await getTodayInterviews();
    const overdue = await getOverdueAssignments();

    const html = buildDailyHtml({
      frogName,
      reminders,
      todayInterviews: interviews,
      overdueAssignments: overdue,
    });

    const cfg = await loadEmailConfig();
    await sendEmail({
      serviceId: cfg.serviceId,
      templateId: cfg.templateId,
      publicKey: cfg.publicKey,
      toEmail: userEmail,
      subject: `${frogName} Daily Digest`,
      htmlBody: html,
    });

    setLastDailySent(todayKey);
    persist({ lastDaily: todayKey });

    return { sent: true };
  };

  const sendWeekly = async ({ force = false } = {}) => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const mondayKey = getTodayKey(monday);

    if (!force && lastWeeklySent === mondayKey)
      return { sent: false, reason: "already_sent" };

    const summary = await getWeeklySummary();
    const html = buildWeeklyHtml({ frogName, summary });

    const cfg = await loadEmailConfig();
    await sendEmail({
      serviceId: cfg.serviceId,
      templateId: cfg.templateId,
      publicKey: cfg.publicKey,
      toEmail: userEmail,
      subject: `${frogName} Weekly Summary`,
      htmlBody: html,
    });

    setLastWeeklySent(mondayKey);
    persist({ lastWeekly: mondayKey });

    return { sent: true };
  };

  // Auto execution (8AM rules)
  useEffect(() => {
    (async () => {
      const cfg = await loadEmailConfig();
      if (!cfg) return;

      const now = new Date();
      const hour = now.getHours();
      const todayKey = getTodayKey(now);

      if (hour >= 8 && lastDailySent !== todayKey) {
        await sendDaily();
      }

      const isMonday = now.getDay() === 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      const mondayKey = getTodayKey(monday);

      if (isMonday && hour >= 8 && lastWeeklySent !== mondayKey) {
        await sendWeekly();
      }
    })();
  }, [lastDailySent, lastWeeklySent]);

  return { sendDaily, sendWeekly };
}
