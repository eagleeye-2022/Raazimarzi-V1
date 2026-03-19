import cron from "node-cron";
import Case    from "../models/caseModel.js";
import Meeting from "../models/meetingModel.js";
import {
  sendRespondentNotice,
  sendAdminAlert,
  sendMeetingReminderEmails,
} from "../services/mail.service.js";
import {
  sendRespondentNoticeWA,
  sendMeetingReminderWA,
} from "../services/whatsapp.service.js";

/* ═══════════════════════════════════════════════════════
   CORE JOB 1: PROCESS NOTICE PERIODS
   - Day 7  → Send 2nd notice (email + WhatsApp)
   - Day 15 → Send 3rd notice (email + WhatsApp)
   - Day 30 → Final notice + alert admin
   - Day 37+ → Re-alert admin if ex-parte not declared
═══════════════════════════════════════════════════════ */
const processNoticePeriods = async () => {
  console.log("⏰ [CRON] Running notice period check...");

  try {
    const now   = new Date();
    const cases = await Case.find({
      status:                    "notice-sent",
      adminStatus:               "accepted",
      "respondent.inviteStatus": "pending",
      noticePeriodStartAt:       { $ne: null },
    }).populate("claimant", "name email");

    if (cases.length === 0) {
      console.log("✅ [CRON] No active notice-period cases found.");
      return;
    }

    console.log(`📋 [CRON] Processing ${cases.length} case(s) in notice period...`);

    for (const caseData of cases) {
      try {
        const startAt       = new Date(caseData.noticePeriodStartAt);
        const endAt         = new Date(caseData.noticePeriodEndAt);
        const daysElapsed   = Math.floor((now - startAt) / (1000 * 60 * 60 * 24));
        const daysLeft      = Math.max(0, Math.ceil((endAt - now) / (1000 * 60 * 60 * 24)));
        const sentNoticeNos = caseData.noticesSent.map((n) => n.noticeNo);

        const respondentEmail = caseData.respondent.email;
        const respondentName  = caseData.respondent.name;
        const respondentPhone = caseData.respondent?.phone || caseData.defendantDetails?.mobile;
        const inviteToken     = caseData.respondent.inviteToken;

        /* ── Helper: send notice via both channels ── */
        const sendNotice = async (noticeNo) => {
          /* Email */
          await sendRespondentNotice({
            to: respondentEmail, name: respondentName,
            caseId: caseData.caseId, caseTitle: caseData.caseTitle,
            noticeNo, daysLeft, inviteToken,
          });
          /* WhatsApp/SMS */
          if (respondentPhone) {
            await sendRespondentNoticeWA({
              phone: respondentPhone, name: respondentName,
              caseId: caseData.caseId, caseTitle: caseData.caseTitle,
              noticeNo, daysLeft, inviteToken,
            });
          }
        };

        /* ── Day 7: Second Notice ── */
        if (daysElapsed >= 7 && !sentNoticeNos.includes(2)) {
          try {
            await sendNotice(2);
            caseData.noticesSent.push({ sentAt: now, channel: "email+whatsapp", noticeNo: 2, message: "7-day reminder sent" });
            caseData.timeline.push({ action: "Notice #2 Sent", performedBy: null, note: `7-day reminder sent to ${respondentEmail}`, isSystem: true });
            console.log(`📧 [CRON] Notice #2 sent for case ${caseData.caseId}`);
          } catch (err) {
            console.error(`❌ [CRON] Notice #2 failed for ${caseData.caseId}:`, err.message);
          }
        }

        /* ── Day 15: Third Notice (Urgent) ── */
        if (daysElapsed >= 15 && !sentNoticeNos.includes(3)) {
          try {
            await sendNotice(3);
            caseData.noticesSent.push({ sentAt: now, channel: "email+whatsapp", noticeNo: 3, message: "15-day urgent reminder sent" });
            caseData.timeline.push({ action: "Notice #3 Sent", performedBy: null, note: `15-day urgent reminder sent to ${respondentEmail}`, isSystem: true });
            console.log(`📧 [CRON] Notice #3 sent for case ${caseData.caseId}`);
          } catch (err) {
            console.error(`❌ [CRON] Notice #3 failed for ${caseData.caseId}:`, err.message);
          }
        }

        /* ── Day 30: Notice Period Expired ── */
        if (now >= endAt && !sentNoticeNos.includes(4)) {
          try {
            await sendNotice(3); // Final notice (noticeNo 3 = final)
            await sendAdminAlert({
              caseId:         caseData.caseId,
              caseTitle:      caseData.caseTitle,
              respondentEmail,
              reason:         "Notice Period Expired — Ex-Parte Action Required",
            });
            caseData.noticesSent.push({ sentAt: now, channel: "email+whatsapp", noticeNo: 4, message: "Notice period expired — admin alerted" });
            caseData.timeline.push({ action: "Notice Period Expired", performedBy: null, note: "30-day notice period has expired. Admin alerted for ex-parte declaration.", isSystem: true });
            console.log(`🚨 [CRON] Notice period expired for case ${caseData.caseId} — admin alerted`);
          } catch (err) {
            console.error(`❌ [CRON] Expiry alert failed for ${caseData.caseId}:`, err.message);
          }
        }

        /* ── Day 37+: Re-alert admin ── */
        if (daysElapsed >= 37 && !caseData.isExParte && !sentNoticeNos.includes(5)) {
          try {
            await sendAdminAlert({
              caseId:         caseData.caseId,
              caseTitle:      caseData.caseTitle,
              respondentEmail,
              reason:         "URGENT: Ex-Parte Not Declared — 7 Days After Notice Expiry",
            });
            caseData.noticesSent.push({ sentAt: now, channel: "system", noticeNo: 5, message: "Admin re-alerted — ex-parte still not declared" });
            caseData.timeline.push({ action: "Admin Re-Alerted", performedBy: null, note: "Notice period expired 7+ days ago. Ex-parte still not declared. Admin re-alerted.", isSystem: true });
            console.log(`🔔 [CRON] Admin re-alerted for case ${caseData.caseId}`);
          } catch (err) {
            console.error(`❌ [CRON] Re-alert failed for ${caseData.caseId}:`, err.message);
          }
        }

        await caseData.save();
      } catch (caseErr) {
        console.error(`❌ [CRON] Error processing case ${caseData.caseId}:`, caseErr.message);
      }
    }

    console.log("✅ [CRON] Notice period check complete.");
  } catch (err) {
    console.error("❌ [CRON] processNoticePeriods fatal error:", err.message);
  }
};

/* ═══════════════════════════════════════════════════════
   CORE JOB 2: MEETING REMINDERS
   Runs every hour — email + WhatsApp/SMS
═══════════════════════════════════════════════════════ */
const processMeetingReminders = async () => {
  console.log("⏰ [CRON] Running meeting reminder check...");

  try {
    const now = new Date();

    const sendReminders = async (meetings, reminderType) => {
      for (const meeting of meetings) {
        try {
          const caseData = await Case.findById(meeting.caseId)
            .populate("claimant",  "name email")
            .populate("createdBy", "name email");

          if (!caseData) continue;

          /* Email reminders */
          await sendMeetingReminderEmails({ meeting, caseData, reminderType });

          /* WhatsApp/SMS reminders — claimant + respondent + mediator */
          const recipients = [
            { phone: caseData.petitionerDetails?.mobile || caseData.claimant?.phone, name: caseData.petitionerDetails?.fullName || caseData.claimant?.name },
            { phone: caseData.respondent?.phone || caseData.defendantDetails?.mobile, name: caseData.respondent?.name || caseData.defendantDetails?.fullName },
            { phone: meeting.mediator?.phone, name: meeting.mediator?.name },
          ].filter(r => r.phone);

          for (const r of recipients) {
            await sendMeetingReminderWA({
              phone:       r.phone,
              name:        r.name || "Participant",
              caseId:      caseData.caseId,
              meetingType: meeting.meetingType,
              date:        meeting.scheduledDate,
              time:        `${meeting.startTime} - ${meeting.endTime}`,
              joinLink:    meeting.virtualMeeting?.meetingLink || "",
              reminderType,
            });
          }

          meeting.remindersSent.push({ reminderType, sentAt: now, recipientCount: recipients.length + 3 });
          await meeting.save();
          console.log(`📧📱 [CRON] ${reminderType} reminder sent for meeting ${meeting._id}`);
        } catch (err) {
          console.error(`❌ [CRON] ${reminderType} reminder failed for meeting ${meeting._id}:`, err.message);
        }
      }
    };

    /* ── 24-hour reminder ── */
    const in24h    = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const meetings24h = await Meeting.find({
      scheduledDate: { $gte: new Date(in24h.getTime() - 5*60*1000), $lte: new Date(in24h.getTime() + 5*60*1000) },
      status:        { $in: ["Scheduled","Confirmed"] },
      "remindersSent.reminderType": { $ne: "24_hours" },
    }).populate("organizer","name email").populate("mediator","name email phone");

    await sendReminders(meetings24h, "24_hours");

    /* ── 1-hour reminder ── */
    const in1h    = new Date(now.getTime() + 60 * 60 * 1000);
    const meetings1h = await Meeting.find({
      scheduledDate: { $gte: new Date(in1h.getTime() - 5*60*1000), $lte: new Date(in1h.getTime() + 5*60*1000) },
      status:        { $in: ["Scheduled","Confirmed"] },
      "remindersSent.reminderType": { $ne: "1_hour" },
    }).populate("organizer","name email").populate("mediator","name email phone");

    await sendReminders(meetings1h, "1_hour");

    console.log(`✅ [CRON] Meeting reminders complete. (24h: ${meetings24h.length}, 1h: ${meetings1h.length})`);
  } catch (err) {
    console.error("❌ [CRON] processMeetingReminders fatal error:", err.message);
  }
};

/* ═══════════════════════════════════════════════════════
   REGISTER ALL CRON JOBS
═══════════════════════════════════════════════════════ */
export const registerCronJobs = () => {
  cron.schedule("0 8 * * *", async () => {
    await processNoticePeriods();
  }, { timezone: "Asia/Kolkata" });

  cron.schedule("0 * * * *", async () => {
    await processMeetingReminders();
  }, { timezone: "Asia/Kolkata" });

  console.log("✅ [CRON] All cron jobs registered.");
  console.log("   → Notice period check: daily at 8:00 AM IST");
  console.log("   → Meeting reminders:   every hour");
};

export const runNoticePeriodCheckNow = processNoticePeriods;
export const runMeetingRemindersNow  = processMeetingReminders;