import nodemailer from "nodemailer";

const validateEmailEnv = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL CONFIG ERROR: EMAIL_USER or EMAIL_PASS missing in .env");
    return false;
  }
  return true;
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (!validateEmailEnv()) throw new Error("Email credentials not configured");
    console.log("📧 Initializing Zoho SMTP transporter...");
    const port   = parseInt(process.env.EMAIL_PORT) || 587;
    const secure = process.env.EMAIL_SECURE === "true" || port === 465;
    transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST || "smtp.zoho.in",
      port, secure,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      logger: true, debug: true,
    });
    console.log(`   Using port ${port} (secure: ${secure})`);
  }
  return transporter;
};

/* ── Safe send — never throws, just logs ── */
const safeSend = async (mailOptions) => {
  try {
    const smtp = getTransporter();
    const info = await smtp.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "RaaziMarzi"}" <${process.env.EMAIL_USER}>`,
      ...mailOptions,
    });
    console.log(`✅ Email sent: ${mailOptions.subject} → ${mailOptions.to}`);
    return info;
  } catch (error) {
    console.warn(`⚠️ Email failed (${mailOptions.subject}):`, error.message);
    return null;
  }
};

/* ════════════════════════════════════════
   SMTP TEST
════════════════════════════════════════ */
export const testSMTP = async () => {
  try {
    console.log("\n🔍 Verifying SMTP credentials...");
    console.log("   User:", process.env.EMAIL_USER);
    console.log("   Pass:", process.env.EMAIL_PASS ? "✅ Set (***" + process.env.EMAIL_PASS.slice(-4) + ")" : "❌ NOT SET");
    const smtp = getTransporter();
    await smtp.verify();
    console.log("✅ Zoho SMTP authentication successful!");
    return true;
  } catch (error) {
    console.error("\n❌ SMTP verification failed!", error.message);
    if (error.code === "EAUTH") console.error("💡 Use Zoho App Password, not your regular password");
    return false;
  }
};

/* ════════════════════════════════════════
   OTP EMAIL
════════════════════════════════════════ */
export const sendOtpMail = async ({ email, otp, type }) => {
  try {
    const smtp    = getTransporter();
    const subject = type === "signup"
      ? "Your Signup OTP - RaaziMarzi"
      : "Your Password Reset OTP - RaaziMarzi";

    const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;}
  .box{max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;}
  .header{background:#667eea;color:#fff;padding:30px;text-align:center;}
  .content{padding:30px;color:#333;}
  .otp{font-size:32px;letter-spacing:6px;font-weight:bold;color:#667eea;text-align:center;margin:20px 0;}
  .footer{background:#f8f9fa;padding:15px;font-size:12px;color:#777;text-align:center;}
</style></head><body>
<div class="box">
  <div class="header"><h2>${subject}</h2></div>
  <div class="content">
    <p>Hello,</p>
    <p>Your One-Time Password (OTP) is:</p>
    <div class="otp">${otp}</div>
    <p>This OTP is valid for <strong>5 minutes</strong>.</p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
  <div class="footer">© ${new Date().getFullYear()} RaaziMarzi. Do not reply.</div>
</div></body></html>`;

    const info = await smtp.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "RaaziMarzi"}" <${process.env.EMAIL_USER}>`,
      to: email, subject, html,
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
    console.log("✅ OTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ OTP send failed:", error.message);
    throw error;
  }
};

/* ════════════════════════════════════════
   CONTACT MAIL
════════════════════════════════════════ */
export const sendContactMail = async ({ name, email, phone, message }) => {
  const smtp = getTransporter();
  await smtp.sendMail({
    from: `"RaaziMarzi" <${process.env.EMAIL_USER}>`,
    to:   process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: "New Contact Request - RaaziMarzi",
    html: `<h3>New Contact Request</h3>
      <p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "N/A"}</p><p><b>Message:</b><br/>${message}</p>`,
  });
  console.log("✅ Contact mail sent");
};

/* ════════════════════════════════════════
   DEMO MAIL
════════════════════════════════════════ */
export const sendDemoMail = async ({ name, email, phone, company, message }) => {
  const smtp = getTransporter();
  await smtp.sendMail({
    from: `"RaaziMarzi" <${process.env.EMAIL_USER}>`,
    to:   process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: "New Demo Request - RaaziMarzi",
    html: `<h3>New Demo Request</h3>
      <p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p><p><b>Company:</b> ${company}</p>
      <p><b>Message:</b><br/>${message}</p>`,
  });
  console.log("✅ Demo mail sent");
};

/* ════════════════════════════════════════
   CASE FILED — email admin with full details
   Replaces inline sendMail in caseController
════════════════════════════════════════ */
export const sendCaseFiledAdminEmail = async ({ caseId, caseType, caseTitle, causeOfAction, reliefSought, caseValue, petitioner, defendant, caseFacts, filedByEmail }) => {
  return safeSend({
    to:      process.env.ADMIN_EMAIL,
    subject: `📁 New Case Filed | ${caseId}`,
    html: `
      <h2>📂 New Case Filed</h2><hr />
      <h3>🧾 Case Details</h3>
      <p><strong>Case ID:</strong> ${caseId}</p>
      <p><strong>Case Type:</strong> ${caseType || "N/A"}</p>
      <p><strong>Title:</strong> ${caseTitle}</p>
      <p><strong>Cause of Action:</strong> ${causeOfAction || "N/A"}</p>
      <p><strong>Relief Sought:</strong> ${reliefSought || "N/A"}</p>
      <p><strong>Case Value:</strong> ${caseValue || "N/A"}</p>
      <hr />
      <h3>👤 Petitioner Details</h3>
      <p><strong>Name:</strong> ${petitioner?.fullName}</p>
      <p><strong>Father/Spouse:</strong> ${petitioner?.fatherName || "N/A"}</p>
      <p><strong>Gender:</strong> ${petitioner?.gender}</p>
      <p><strong>DOB:</strong> ${petitioner?.dob}</p>
      <p><strong>Mobile:</strong> ${petitioner?.mobile}</p>
      <p><strong>Email:</strong> ${petitioner?.email}</p>
      <p><strong>Address:</strong> ${petitioner?.address || "N/A"}</p>
      <p><strong>ID Proof:</strong> ${petitioner?.idType || ""} ${petitioner?.idProof || ""}</p>
      <hr />
      <h3>👥 Defendant Details</h3>
      <p><strong>Name:</strong> ${defendant?.fullName}</p>
      <p><strong>Father/Spouse:</strong> ${defendant?.fatherName || "N/A"}</p>
      <p><strong>Gender:</strong> ${defendant?.gender || "N/A"}</p>
      <p><strong>DOB:</strong> ${defendant?.dob || "N/A"}</p>
      <p><strong>Mobile:</strong> ${defendant?.mobile}</p>
      <p><strong>Email:</strong> ${defendant?.email}</p>
      <p><strong>ID Details:</strong> ${defendant?.idDetails || "N/A"}</p>
      <hr />
      <h3>📑 Case Facts & Evidence</h3>
      <p><strong>Summary:</strong> ${caseFacts?.caseSummary || "N/A"}</p>
      <p><strong>Document Title:</strong> ${caseFacts?.documentTitle || "N/A"}</p>
      <p><strong>Document Type:</strong> ${caseFacts?.documentType || "N/A"}</p>
      <p><strong>Witness Details:</strong> ${caseFacts?.witnessDetails || "N/A"}</p>
      <p><strong>Place:</strong> ${caseFacts?.place || "N/A"}</p>
      <p><strong>Date:</strong> ${caseFacts?.date || "N/A"}</p>
      <hr />
      <h3>👨‍💼 Filed By</h3>
      <p><strong>User Email:</strong> ${filedByEmail}</p>
      <p><strong>Filed At:</strong> ${new Date().toLocaleString()}</p>
      <br /><p style="color:gray;">— RaaziMarzi System</p>
    `,
  });
};

/* ════════════════════════════════════════
   LEGAL NOTICE TO RESPONDENT
   Replaces inline sendMail in adminController.reviewCase
   Also used by noticePeriod.cron
════════════════════════════════════════ */
export const sendRespondentNotice = async ({ to, name, caseId, caseTitle, noticeNo = 1, daysLeft, inviteToken, deadlineDate }) => {
  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite/${inviteToken}`;

  const subjectMap = {
    1: `⚖️ Legal Notice | Case ${caseId}`,
    2: `⚠️ Reminder: Response Required | Case ${caseId}`,
    3: `🚨 Final Notice: Last Chance to Respond | Case ${caseId}`,
  };

  const urgencyMap = {
    1: { label: "Legal Notice",    color: "#2563eb", intro: "A case has been filed against you on the RaaziMarzi Online Dispute Resolution platform." },
    2: { label: "Second Reminder", color: "#d97706", intro: "You have not yet responded to the case filed against you." },
    3: { label: "Final Notice",    color: "#dc2626", intro: "This is your FINAL notice. If you do not respond, the case will proceed without you (ex-parte)." },
  };

  const { label, color, intro } = urgencyMap[noticeNo] || urgencyMap[1];

  return safeSend({
    to,
    subject: subjectMap[noticeNo] || subjectMap[1],
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:${color};padding:20px;border-radius:8px 8px 0 0;">
          <h2 style="color:white;margin:0;">RaaziMarzi — ${label}</h2>
        </div>
        <div style="border:1px solid #e5e7eb;padding:24px;border-radius:0 0 8px 8px;">
          <p>Dear <strong>${name || "Respondent"}</strong>,</p>
          <p>${intro}</p>
          <div style="background:#f9fafb;border-left:4px solid ${color};padding:16px;margin:20px 0;border-radius:4px;">
            <p style="margin:4px 0;"><strong>Case ID:</strong> ${caseId}</p>
            <p style="margin:4px 0;"><strong>Case Title:</strong> ${caseTitle}</p>
            ${deadlineDate ? `<p style="margin:4px 0;"><strong>Response Deadline:</strong> ${deadlineDate}</p>` : ""}
            ${daysLeft !== undefined ? `<p style="margin:4px 0;"><strong>Days Remaining:</strong> ${daysLeft} day${daysLeft !== 1 ? "s" : ""}</p>` : ""}
          </div>
          <p>You are required to respond to this case within the notice period. Failure to do so may result in:</p>
          <ul>
            <li>The case proceeding <strong>ex-parte</strong> (without your participation)</li>
            <li>An <strong>arbitration award</strong> being issued against you</li>
            <li>The claimant being advised to <strong>enforce the award through civil court</strong></li>
          </ul>
          <div style="text-align:center;margin:30px 0;">
            <a href="${inviteUrl}" style="background:${color};color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
              View Case &amp; Respond Now
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;">
            If you believe you received this notice in error, contact us at
            <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            — RaaziMarzi Online Dispute Resolution Platform<br/>
            This is an automated legal notice. Please do not ignore.
          </p>
        </div>
      </div>
    `,
  });
};

/* ════════════════════════════════════════
   ADMIN ALERT — notice period / ex-parte
   Replaces inline sendAdminAlert in cron
════════════════════════════════════════ */
export const sendAdminAlert = async ({ caseId, caseTitle, respondentEmail, reason }) => {
  return safeSend({
    to:      process.env.ADMIN_EMAIL,
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

/* ════════════════════════════════════════
   MEETING EMAIL HELPER — shared HTML wrapper
════════════════════════════════════════ */
const meetingEmailHtml = ({ title, headerColor = "#7C3AED", recipientName, body, meetingDetails, joinLink }) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;margin:0;}
  .box{max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
  .header{background:${headerColor};color:#fff;padding:28px 30px;}
  .header h2{margin:0;font-size:20px;}
  .content{padding:30px;color:#333;line-height:1.6;}
  .details-box{background:#f8f7ff;border-left:4px solid ${headerColor};padding:16px 20px;border-radius:4px;margin:20px 0;}
  .details-box p{margin:6px 0;font-size:14px;}
  .details-box strong{color:#555;min-width:130px;display:inline-block;}
  .btn{display:inline-block;background:${headerColor};color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;margin:20px 0;}
  .footer{background:#f8f9fa;padding:16px;font-size:12px;color:#888;text-align:center;border-top:1px solid #eee;}
  .agenda-list{margin:8px 0;padding-left:20px;}
  .agenda-list li{font-size:14px;margin:4px 0;}
</style></head><body>
<div class="box">
  <div class="header"><h2>⚖️ ${title}</h2></div>
  <div class="content">
    <p>Dear <strong>${recipientName}</strong>,</p>
    ${body}
    <div class="details-box">${meetingDetails}</div>
    ${joinLink ? `<a href="${joinLink}" class="btn">Join Meeting</a>` : ""}
    <p style="font-size:13px;color:#888;">Questions? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
  </div>
  <div class="footer">— RaaziMarzi Online Dispute Resolution Platform<br/>This is an automated notification.</div>
</div></body></html>
`;

/* ════════════════════════════════════════
   MEETING SCHEDULED — notify all parties
════════════════════════════════════════ */
export const sendMeetingScheduledEmails = async ({ meeting, caseData }) => {
  const { meetingTitle, meetingType, scheduledDate, startTime, endTime, timezone, virtualMeeting, physicalLocation, locationType, agendaItems, organizer, mediator } = meeting;

  const dateStr  = new Date(scheduledDate).toDateString();
  const timeStr  = `${startTime} – ${endTime} (${timezone || "IST"})`;
  const joinLink = virtualMeeting?.meetingLink || "";
  const locationStr = locationType === "virtual"
    ? (joinLink ? `Virtual — <a href="${joinLink}">${joinLink}</a>` : "Virtual (link will be shared)")
    : `${physicalLocation?.venue || ""}, ${physicalLocation?.address || ""}, ${physicalLocation?.city || ""}`;

  const agendaHtml = agendaItems?.length > 0
    ? `<p><strong>Agenda:</strong></p><ul class="agenda-list">${agendaItems.map(a => `<li>${a.item}</li>`).join("")}</ul>`
    : "";

  const detailsHtml = `
    <p><strong>Case ID:</strong> ${caseData.caseId}</p>
    <p><strong>Case Title:</strong> ${caseData.caseTitle}</p>
    <p><strong>Meeting Type:</strong> ${meetingType}</p>
    <p><strong>Date:</strong> ${dateStr}</p>
    <p><strong>Time:</strong> ${timeStr}</p>
    <p><strong>Location:</strong> ${locationStr}</p>
  `;

  const emails = [];

  const claimantEmail = caseData.petitionerDetails?.email || caseData.claimant?.email;
  const claimantName  = caseData.petitionerDetails?.fullName || caseData.claimant?.name || "Claimant";
  if (claimantEmail) {
    emails.push(safeSend({ to: claimantEmail, subject: `📅 Meeting Scheduled | ${caseData.caseId} | ${dateStr}`,
      html: meetingEmailHtml({ title: `${meetingType} Scheduled`, headerColor: "#2563eb", recipientName: claimantName,
        body: `<p>A <strong>${meetingType}</strong> has been scheduled for your case.</p>${agendaHtml}`, meetingDetails: detailsHtml, joinLink }) }));
  }

  const respondentEmail = caseData.respondent?.email || caseData.defendantDetails?.email;
  const respondentName  = caseData.respondent?.name  || caseData.defendantDetails?.fullName || "Respondent";
  if (respondentEmail) {
    emails.push(safeSend({ to: respondentEmail, subject: `📅 Meeting Scheduled | Case ${caseData.caseId} | ${dateStr}`,
      html: meetingEmailHtml({ title: `${meetingType} Scheduled`, headerColor: "#dc2626", recipientName: respondentName,
        body: `<p>A <strong>${meetingType}</strong> has been scheduled for the case filed against you. Your attendance is required.</p>${agendaHtml}`, meetingDetails: detailsHtml, joinLink }) }));
  }

  if (mediator?.email) {
    emails.push(safeSend({ to: mediator.email, subject: `📅 Meeting Assignment | ${caseData.caseId} | ${dateStr}`,
      html: meetingEmailHtml({ title: `Meeting Assignment — ${meetingType}`, headerColor: "#7C3AED", recipientName: mediator.name || "Mediator",
        body: `<p>You have been assigned to conduct a <strong>${meetingType}</strong>.</p>${agendaHtml}`, meetingDetails: detailsHtml, joinLink }) }));
  }

  if (organizer?.email) {
    emails.push(safeSend({ to: organizer.email, subject: `✅ Meeting Scheduled | ${caseData.caseId}`,
      html: meetingEmailHtml({ title: "Meeting Scheduled Successfully", headerColor: "#16a34a", recipientName: organizer.name || "Case Manager",
        body: `<p>You have successfully scheduled a <strong>${meetingType}</strong>. All parties have been notified.</p>`, meetingDetails: detailsHtml, joinLink }) }));
  }

  await Promise.allSettled(emails);
  console.log(`📧 Meeting notifications sent for case ${caseData.caseId}`);
};

/* ════════════════════════════════════════
   MEETING RESCHEDULED
════════════════════════════════════════ */
export const sendMeetingRescheduledEmails = async ({ meeting, caseData, rescheduledBy }) => {
  const { scheduledDate, startTime, endTime, timezone, virtualMeeting, meetingType } = meeting;
  const dateStr  = new Date(scheduledDate).toDateString();
  const timeStr  = `${startTime} – ${endTime} (${timezone || "IST"})`;
  const joinLink = virtualMeeting?.meetingLink || "";

  const detailsHtml = `
    <p><strong>Case ID:</strong> ${caseData.caseId}</p>
    <p><strong>New Date:</strong> ${dateStr}</p>
    <p><strong>New Time:</strong> ${timeStr}</p>
    <p><strong>Rescheduled By:</strong> ${rescheduledBy?.name || "Case Manager"}</p>
  `;

  const recipients = [
    { email: caseData.petitionerDetails?.email || caseData.claimant?.email,  name: caseData.petitionerDetails?.fullName || caseData.claimant?.name || "Claimant" },
    { email: caseData.respondent?.email || caseData.defendantDetails?.email, name: caseData.respondent?.name || caseData.defendantDetails?.fullName || "Respondent" },
    { email: meeting.mediator?.email,  name: meeting.mediator?.name  || "Mediator" },
    { email: meeting.organizer?.email, name: meeting.organizer?.name || "Organizer" },
  ].filter(r => r.email);

  await Promise.allSettled(recipients.map(r => safeSend({
    to: r.email, subject: `🔄 Meeting Rescheduled | ${caseData.caseId} | New Date: ${dateStr}`,
    html: meetingEmailHtml({ title: "Meeting Rescheduled", headerColor: "#d97706", recipientName: r.name,
      body: `<p>The <strong>${meetingType}</strong> has been <strong>rescheduled</strong>. Please note the new date and time.</p>`,
      meetingDetails: detailsHtml, joinLink }),
  })));
  console.log(`📧 Reschedule notifications sent for case ${caseData.caseId}`);
};

/* ════════════════════════════════════════
   MEETING CANCELLED
════════════════════════════════════════ */
export const sendMeetingCancelledEmails = async ({ meeting, caseData, reason }) => {
  const detailsHtml = `
    <p><strong>Case ID:</strong> ${caseData.caseId}</p>
    <p><strong>Case Title:</strong> ${caseData.caseTitle}</p>
    <p><strong>Meeting Type:</strong> ${meeting.meetingType}</p>
    <p><strong>Was Scheduled For:</strong> ${new Date(meeting.scheduledDate).toDateString()} ${meeting.startTime}</p>
    <p><strong>Reason:</strong> ${reason || "Cancelled by case manager"}</p>
  `;

  const recipients = [
    { email: caseData.petitionerDetails?.email || caseData.claimant?.email,  name: caseData.petitionerDetails?.fullName || caseData.claimant?.name || "Claimant" },
    { email: caseData.respondent?.email || caseData.defendantDetails?.email, name: caseData.respondent?.name || caseData.defendantDetails?.fullName || "Respondent" },
    { email: meeting.mediator?.email,  name: meeting.mediator?.name  || "Mediator" },
    { email: meeting.organizer?.email, name: meeting.organizer?.name || "Organizer" },
  ].filter(r => r.email);

  await Promise.allSettled(recipients.map(r => safeSend({
    to: r.email, subject: `❌ Meeting Cancelled | ${caseData.caseId}`,
    html: meetingEmailHtml({ title: "Meeting Cancelled", headerColor: "#dc2626", recipientName: r.name,
      body: `<p>The scheduled <strong>${meeting.meetingType}</strong> for case <strong>${caseData.caseId}</strong> has been <strong>cancelled</strong>.</p>`,
      meetingDetails: detailsHtml, joinLink: "" }),
  })));
  console.log(`📧 Cancellation notifications sent for case ${caseData.caseId}`);
};

/* ════════════════════════════════════════
   MEETING REMINDER — 24h / 1h before
   Called by cron job
════════════════════════════════════════ */
export const sendMeetingReminderEmails = async ({ meeting, caseData, reminderType }) => {
  const { scheduledDate, startTime, endTime, timezone, virtualMeeting, meetingType } = meeting;
  const dateStr       = new Date(scheduledDate).toDateString();
  const timeStr       = `${startTime} – ${endTime} (${timezone || "IST"})`;
  const joinLink      = virtualMeeting?.meetingLink || "";
  const reminderLabel = reminderType === "24_hours" ? "Tomorrow" : "In 1 Hour";
  const urgencyColor  = reminderType === "24_hours" ? "#2563eb" : "#dc2626";

  const detailsHtml = `
    <p><strong>Case ID:</strong> ${caseData.caseId}</p>
    <p><strong>Case Title:</strong> ${caseData.caseTitle}</p>
    <p><strong>Meeting Type:</strong> ${meetingType}</p>
    <p><strong>Date:</strong> ${dateStr}</p>
    <p><strong>Time:</strong> ${timeStr}</p>
    ${joinLink ? `<p><strong>Join Link:</strong> <a href="${joinLink}">${joinLink}</a></p>` : ""}
  `;

  const recipients = [
    { email: caseData.petitionerDetails?.email || caseData.claimant?.email,  name: caseData.petitionerDetails?.fullName || caseData.claimant?.name || "Claimant" },
    { email: caseData.respondent?.email || caseData.defendantDetails?.email, name: caseData.respondent?.name || caseData.defendantDetails?.fullName || "Respondent" },
    { email: meeting.mediator?.email, name: meeting.mediator?.name || "Mediator" },
  ].filter(r => r.email);

  await Promise.allSettled(recipients.map(r => safeSend({
    to: r.email, subject: `⏰ Reminder: Meeting ${reminderLabel} | ${caseData.caseId} | ${dateStr}`,
    html: meetingEmailHtml({ title: `Meeting Reminder — ${reminderLabel}`, headerColor: urgencyColor, recipientName: r.name,
      body: `<p>Your <strong>${meetingType}</strong> is scheduled <strong>${reminderLabel.toLowerCase()}</strong>. Please be prepared and join on time.</p>`,
      meetingDetails: detailsHtml, joinLink }),
  })));
  console.log(`📧 ${reminderType} reminders sent for case ${caseData.caseId}`);
};

/* ════════════════════════════════════════
   ARBITRATION AWARD ISSUED
   Notifies claimant, respondent, and admin
   Called by arbitratorController.issueAward
════════════════════════════════════════ */
export const sendAwardIssuedEmails = async ({ caseData, awardType, awardInFavorOf, awardAmount, resolutionSummary, enforcementNotes, arbitratorName }) => {

  const awardTypeLabel = {
    "arbitration-award": "Arbitration Award",
    "ex-parte-award":    "Ex-Parte Arbitration Award",
    "consent-award":     "Consent Award",
  }[awardType] || "Arbitration Award";

  const favorLabel = {
    "claimant":   "in favor of the Claimant",
    "respondent": "in favor of the Respondent",
    "partial":    "partially in favor of both parties",
  }[awardInFavorOf] || "";

  const detailsHtml = `
    <p><strong>Case ID:</strong> ${caseData.caseId}</p>
    <p><strong>Case Title:</strong> ${caseData.caseTitle}</p>
    <p><strong>Award Type:</strong> ${awardTypeLabel}</p>
    <p><strong>Decision:</strong> ${favorLabel}</p>
    ${awardAmount ? `<p><strong>Award Amount:</strong> ₹${Number(awardAmount).toLocaleString("en-IN")}</p>` : ""}
    <p><strong>Arbitrator:</strong> ${arbitratorName || "RaaziMarzi Arbitrator"}</p>
    <p><strong>Issued On:</strong> ${new Date().toDateString()}</p>
  `;

  const summaryShort = resolutionSummary?.substring(0, 300) || "";
  const enforceNote  = enforcementNotes ? `<p><strong>Enforcement:</strong> ${enforcementNotes}</p>` : "";

  const emails = [];

  /* ── Claimant ── */
  const claimantEmail = caseData.petitionerDetails?.email || caseData.claimant?.email;
  const claimantName  = caseData.petitionerDetails?.fullName || caseData.claimant?.name || "Claimant";
  if (claimantEmail) {
    emails.push(safeSend({
      to:      claimantEmail,
      subject: `⚖️ Arbitration Award Issued | Case ${caseData.caseId}`,
      html:    meetingEmailHtml({
        title:          `${awardTypeLabel} Issued`,
        headerColor:    "#1d4ed8",
        recipientName:  claimantName,
        body: `
          <p>The arbitration proceedings for your case have concluded and an award has been issued.</p>
          <p><strong>Award Summary:</strong><br/>${summaryShort}</p>
          ${enforceNote}
          <p style="font-size:13px;color:#888;">This award is legally binding. If you need to enforce it, please consult with a legal professional.</p>
        `,
        meetingDetails: detailsHtml,
        joinLink: "",
      }),
    }));
  }

  /* ── Respondent ── */
  const respondentEmail = caseData.respondent?.email || caseData.defendantDetails?.email;
  const respondentName  = caseData.respondent?.name  || caseData.defendantDetails?.fullName || "Respondent";
  if (respondentEmail) {
    emails.push(safeSend({
      to:      respondentEmail,
      subject: `⚖️ Arbitration Award Issued | Case ${caseData.caseId}`,
      html:    meetingEmailHtml({
        title:          `${awardTypeLabel} Issued`,
        headerColor:    "#dc2626",
        recipientName:  respondentName,
        body: `
          <p>The arbitration proceedings for the case filed against you have concluded and an award has been issued.</p>
          <p><strong>Award Summary:</strong><br/>${summaryShort}</p>
          ${enforceNote}
          <p style="font-size:13px;color:#888;">This award is legally binding. You are required to comply with the terms. If you wish to challenge this award, please consult a legal professional immediately.</p>
        `,
        meetingDetails: detailsHtml,
        joinLink: "",
      }),
    }));
  }

  /* ── Admin ── */
  emails.push(safeSend({
    to:      process.env.ADMIN_EMAIL,
    subject: `✅ Award Issued | ${awardTypeLabel} | Case ${caseData.caseId}`,
    html:    meetingEmailHtml({
      title:          "Arbitration Award Issued",
      headerColor:    "#16a34a",
      recipientName:  "Admin",
      body: `<p>An arbitration award has been issued for case <strong>${caseData.caseId}</strong> by ${arbitratorName || "arbitrator"}.</p>`,
      meetingDetails: detailsHtml,
      joinLink: "",
    }),
  }));

  await Promise.allSettled(emails);
  console.log(`📧 Award notifications sent for case ${caseData.caseId}`);
};

export default getTransporter;