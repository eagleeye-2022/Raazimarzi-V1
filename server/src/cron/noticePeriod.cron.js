import cron from "node-cron";
import nodemailer from "nodemailer";
import Case from "../models/caseModel.js";

/* ── Mailer ── */
const getTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

/* ═══════════════════════════════════════════════════════
   SEND NOTICE EMAIL TO RESPONDENT
═══════════════════════════════════════════════════════ */
const sendNoticeEmail = async ({ to, name, caseId, caseTitle, noticeNo, daysLeft, inviteToken }) => {
  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite/${inviteToken}`;

  const subjectMap = {
    1: `⚖️ Legal Notice | Case ${caseId}`,
    2: `⚠️ Reminder: Response Required | Case ${caseId}`,
    3: `🚨 Final Notice: Last Chance to Respond | Case ${caseId}`,
  };

  const urgencyMap = {
    1: { label: "First Notice",  color: "#2563eb", intro: "A case has been filed against you." },
    2: { label: "Second Reminder", color: "#d97706", intro: "You have not yet responded to the case filed against you." },
    3: { label: "Final Notice",  color: "#dc2626", intro: "This is your FINAL notice. If you do not respond, the case will proceed without you (ex-parte)." },
  };

  const { label, color, intro } = urgencyMap[noticeNo] || urgencyMap[1];

  await getTransporter().sendMail({
    from: `"RaaziMarzi Legal" <${process.env.EMAIL_USER}>`,
    to,
    subject: subjectMap[noticeNo] || subjectMap[1],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${color}; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">RaaziMarzi — ${label}</h2>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 24px; border-radius: 0 0 8px 8px;">
          <p>Dear <strong>${name || "Respondent"}</strong>,</p>
          <p>${intro}</p>

          <div style="background: #f9fafb; border-left: 4px solid ${color}; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 4px 0;"><strong>Case ID:</strong> ${caseId}</p>
            <p style="margin: 4px 0;"><strong>Case Title:</strong> ${caseTitle}</p>
            <p style="margin: 4px 0;"><strong>Days Remaining:</strong> ${daysLeft} day${daysLeft !== 1 ? "s" : ""}</p>
          </div>

          <p>You are required to respond to this case within the notice period. Failure to do so may result in:</p>
          <ul>
            <li>The case proceeding <strong>ex-parte</strong> (without your participation)</li>
            <li>An <strong>arbitration award</strong> being issued against you</li>
            <li>The claimant being advised to <strong>enforce the award through civil court</strong></li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}"
               style="background: ${color}; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View Case & Respond Now
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px;">
            If you believe you received this notice in error, please contact us at
            <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            — RaaziMarzi Online Dispute Resolution Platform<br/>
            This is an automated legal notice. Please do not ignore.
          </p>
        </div>
      </div>
    `,
  });
};

/* ═══════════════════════════════════════════════════════
   SEND ADMIN ALERT EMAIL
═══════════════════════════════════════════════════════ */
const sendAdminAlert = async ({ caseId, caseTitle, respondentEmail, reason }) => {
  await getTransporter().sendMail({
    from: `"RaaziMarzi System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚨 Action Required | ${reason} | Case ${caseId}`,
    html: `
      <h2>🚨 Admin Action Required</h2>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Case ID:</strong> ${caseId}</p>
      <p><strong>Case Title:</strong> ${caseTitle}</p>
      <p><strong>Respondent Email:</strong> ${respondentEmail}</p>
      <p>Please log in to the admin dashboard to review and take action.</p>
      <p style="color:gray;">— RaaziMarzi System (Automated)</p>
    `,
  });
};

/* ═══════════════════════════════════════════════════════
   CORE JOB: PROCESS NOTICE PERIODS
   
   Logic:
   - Finds all cases in "notice-sent" status where respondent
     hasn't accepted yet and notice period hasn't been processed
   - Day 7  → Send 2nd notice (reminder)
   - Day 15 → Send 3rd notice (urgent reminder)  
   - Day 30 → Send final notice + alert admin to declare ex-parte
   - Day 30+ → If admin hasn't acted, auto-flag in timeline
═══════════════════════════════════════════════════════ */
const processNoticePeriods = async () => {
  console.log("⏰ [CRON] Running notice period check...");

  try {
    const now = new Date();

    /* Find all active notice-period cases */
    const cases = await Case.find({
      status: "notice-sent",
      adminStatus: "accepted",
      "respondent.inviteStatus": "pending",
      noticePeriodStartAt: { $ne: null },
    }).populate("claimant", "name email");

    if (cases.length === 0) {
      console.log("✅ [CRON] No active notice-period cases found.");
      return;
    }

    console.log(`📋 [CRON] Processing ${cases.length} case(s) in notice period...`);

    for (const caseData of cases) {
      try {
        const startAt   = new Date(caseData.noticePeriodStartAt);
        const endAt     = new Date(caseData.noticePeriodEndAt);
        const daysElapsed = Math.floor((now - startAt) / (1000 * 60 * 60 * 24));
        const daysLeft    = Math.max(0, Math.ceil((endAt - now) / (1000 * 60 * 60 * 24)));

        /* Notices already sent — track by noticeNo */
        const sentNoticeNos = caseData.noticesSent.map((n) => n.noticeNo);

        const respondentEmail = caseData.respondent.email;
        const respondentName  = caseData.respondent.name;
        const inviteToken     = caseData.respondent.inviteToken;

        /* ── Day 7: Second Notice ── */
        if (daysElapsed >= 7 && !sentNoticeNos.includes(2)) {
          try {
            await sendNoticeEmail({
              to: respondentEmail, name: respondentName,
              caseId: caseData.caseId, caseTitle: caseData.caseTitle,
              noticeNo: 2, daysLeft, inviteToken,
            });

            caseData.noticesSent.push({ sentAt: now, channel: "email", noticeNo: 2, message: "7-day reminder sent" });
            caseData.timeline.push({ action: "Notice #2 Sent", performedBy: null, note: `7-day reminder sent to ${respondentEmail}`, isSystem: true });

            console.log(`📧 [CRON] Notice #2 sent for case ${caseData.caseId}`);
          } catch (err) {
            console.error(`❌ [CRON] Notice #2 email failed for ${caseData.caseId}:`, err.message);
          }
        }

        /* ── Day 15: Third Notice (Urgent) ── */
        if (daysElapsed >= 15 && !sentNoticeNos.includes(3)) {
          try {
            await sendNoticeEmail({
              to: respondentEmail, name: respondentName,
              caseId: caseData.caseId, caseTitle: caseData.caseTitle,
              noticeNo: 3, daysLeft, inviteToken,
            });

            caseData.noticesSent.push({ sentAt: now, channel: "email", noticeNo: 3, message: "15-day urgent reminder sent" });
            caseData.timeline.push({ action: "Notice #3 Sent", performedBy: null, note: `15-day urgent reminder sent to ${respondentEmail}`, isSystem: true });

            console.log(`📧 [CRON] Notice #3 sent for case ${caseData.caseId}`);
          } catch (err) {
            console.error(`❌ [CRON] Notice #3 email failed for ${caseData.caseId}:`, err.message);
          }
        }

        /* ── Day 30: Notice Period Expired ── */
        if (now >= endAt && !sentNoticeNos.includes(4)) {
          try {
            /* Final notice to respondent */
            await sendNoticeEmail({
              to: respondentEmail, name: respondentName,
              caseId: caseData.caseId, caseTitle: caseData.caseTitle,
              noticeNo: 3, daysLeft: 0, inviteToken,
            });

            /* Alert admin to take action */
            await sendAdminAlert({
              caseId: caseData.caseId,
              caseTitle: caseData.caseTitle,
              respondentEmail,
              reason: "Notice Period Expired — Ex-Parte Action Required",
            });

            caseData.noticesSent.push({ sentAt: now, channel: "email", noticeNo: 4, message: "Notice period expired — admin alerted" });
            caseData.timeline.push({ action: "Notice Period Expired", performedBy: null, note: "30-day notice period has expired. Admin alerted for ex-parte declaration.", isSystem: true });

            console.log(`🚨 [CRON] Notice period expired for case ${caseData.caseId} — admin alerted`);
          } catch (err) {
            console.error(`❌ [CRON] Expiry alert failed for ${caseData.caseId}:`, err.message);
          }
        }

        /* ── Day 37+: Auto-flag if admin hasn't acted ── */
        if (daysElapsed >= 37 && !caseData.isExParte && !sentNoticeNos.includes(5)) {
          try {
            await sendAdminAlert({
              caseId: caseData.caseId,
              caseTitle: caseData.caseTitle,
              respondentEmail,
              reason: "URGENT: Ex-Parte Not Declared — 7 Days After Notice Expiry",
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
        /* Continue processing other cases even if one fails */
      }
    }

    console.log("✅ [CRON] Notice period check complete.");
  } catch (err) {
    console.error("❌ [CRON] processNoticePeriods fatal error:", err.message);
  }
};

/* ═══════════════════════════════════════════════════════
   REGISTER ALL CRON JOBS
   Called once from server.js on startup
═══════════════════════════════════════════════════════ */
export const registerCronJobs = () => {
  /* ── Notice Period Check — runs every day at 8:00 AM ── */
  cron.schedule("0 8 * * *", async () => {
    await processNoticePeriods();
  }, {
    timezone: "Asia/Kolkata", // IST — change to UTC for global
  });

  console.log("✅ [CRON] All cron jobs registered.");
  console.log("   → Notice period check: daily at 8:00 AM IST");
};

/* ── Manual trigger for testing (call from a test route) ── */
export const runNoticePeriodCheckNow = processNoticePeriods;