import twilio from "twilio";

/* ── Twilio client (lazy init — only created when first used) ── */
let client = null;

const getClient = () => {
  if (!client) {
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    if (!sid || !token) {
      throw new Error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN missing in .env");
    }
    client = twilio(sid, token);
  }
  return client;
};

/* ── Format phone number to E.164 (+91XXXXXXXXXX) ── */
const formatPhone = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, ""); // remove non-digits
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`; // India default
  if (cleaned.startsWith("+"))  return phone;
  return `+${cleaned}`;
};

/* ════════════════════════════════════════════════════════════════
   SAFE SEND — never throws, just logs
   Tries WhatsApp first, falls back to SMS if WhatsApp fails
════════════════════════════════════════════════════════════════ */
const safeSend = async ({ to, message, preferWhatsApp = true }) => {
  const phone = formatPhone(to);
  if (!phone) {
    console.warn("⚠️ WhatsApp/SMS skipped — invalid phone number:", to);
    return null;
  }

  const whatsappFrom = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
  const smsFrom      = process.env.TWILIO_PHONE_NUMBER;
  const whatsappTo   = `whatsapp:${phone}`;

  /* ── Try WhatsApp first ── */
  if (preferWhatsApp && whatsappFrom && process.env.TWILIO_WHATSAPP_NUMBER) {
    try {
      const msg = await getClient().messages.create({
        from: whatsappFrom,
        to:   whatsappTo,
        body: message,
      });
      console.log(`✅ WhatsApp sent to ${phone} — SID: ${msg.sid}`);
      return { channel: "whatsapp", sid: msg.sid };
    } catch (err) {
      console.warn(`⚠️ WhatsApp failed for ${phone}: ${err.message} — trying SMS fallback`);
    }
  }

  /* ── SMS fallback ── */
  if (smsFrom) {
    try {
      const msg = await getClient().messages.create({
        from: smsFrom,
        to:   phone,
        body: message,
      });
      console.log(`✅ SMS sent to ${phone} — SID: ${msg.sid}`);
      return { channel: "sms", sid: msg.sid };
    } catch (err) {
      console.warn(`⚠️ SMS also failed for ${phone}: ${err.message}`);
    }
  }

  console.warn(`⚠️ Both WhatsApp and SMS failed for ${phone}`);
  return null;
};

/* ════════════════════════════════════════════════════════════════
   1. LEGAL NOTICE TO RESPONDENT
   Sent when admin accepts a case — most critical notification
════════════════════════════════════════════════════════════════ */
export const sendRespondentNoticeWA = async ({ phone, name, caseId, caseTitle, noticeNo = 1, daysLeft, inviteToken, deadlineDate }) => {
  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite/${inviteToken}`;

  const messages = {
    1: `⚖️ *Legal Notice from RaaziMarzi*\n\nDear ${name || "Respondent"},\n\nA case has been filed against you on the RaaziMarzi Online Dispute Resolution platform.\n\n📋 *Case ID:* ${caseId}\n📝 *Case Title:* ${caseTitle}\n📅 *Response Deadline:* ${deadlineDate}\n\nYou must respond within 30 days to avoid ex-parte proceedings.\n\n👉 View & respond: ${inviteUrl}\n\n_RaaziMarzi ODR Platform_`,

    2: `⚠️ *Reminder: Response Required*\n\nDear ${name || "Respondent"},\n\nYou have not yet responded to the case filed against you.\n\n📋 *Case ID:* ${caseId}\n⏰ *Days Remaining:* ${daysLeft} day${daysLeft !== 1 ? "s" : ""}\n\nPlease respond before the deadline to avoid ex-parte proceedings.\n\n👉 View & respond: ${inviteUrl}\n\n_RaaziMarzi ODR Platform_`,

    3: `🚨 *FINAL NOTICE — Last Chance to Respond*\n\nDear ${name || "Respondent"},\n\nThis is your FINAL notice. If you do not respond, the case will proceed WITHOUT you (ex-parte).\n\n📋 *Case ID:* ${caseId}\n⏰ *Days Remaining:* ${daysLeft} day${daysLeft !== 1 ? "s" : ""}\n\n⚠️ Failure to respond may result in an arbitration award against you.\n\n👉 View & respond NOW: ${inviteUrl}\n\n_RaaziMarzi ODR Platform_`,
  };

  return safeSend({
    to:      phone,
    message: messages[noticeNo] || messages[1],
  });
};

/* ════════════════════════════════════════════════════════════════
   2. MEETING SCHEDULED — notify all parties
════════════════════════════════════════════════════════════════ */
export const sendMeetingScheduledWA = async ({ phone, name, caseId, caseTitle, meetingType, date, time, joinLink }) => {
  const dateStr = new Date(date).toDateString();
  const linkLine = joinLink ? `\n🔗 *Join:* ${joinLink}` : "";

  const message = `📅 *Meeting Scheduled — RaaziMarzi*\n\nDear ${name},\n\nA *${meetingType}* has been scheduled for your case.\n\n📋 *Case ID:* ${caseId}\n📝 *Case:* ${caseTitle}\n📆 *Date:* ${dateStr}\n⏰ *Time:* ${time}${linkLine}\n\nPlease join on time.\n\n_RaaziMarzi ODR Platform_`;

  return safeSend({ to: phone, message });
};

/* ════════════════════════════════════════════════════════════════
   3. MEETING REMINDER — 24h / 1h before
════════════════════════════════════════════════════════════════ */
export const sendMeetingReminderWA = async ({ phone, name, caseId, meetingType, date, time, joinLink, reminderType }) => {
  const dateStr      = new Date(date).toDateString();
  const reminderText = reminderType === "24_hours" ? "tomorrow" : "in 1 hour";
  const urgencyEmoji = reminderType === "24_hours" ? "📅" : "🔔";
  const linkLine     = joinLink ? `\n🔗 *Join:* ${joinLink}` : "";

  const message = `${urgencyEmoji} *Meeting Reminder — RaaziMarzi*\n\nDear ${name},\n\nYour *${meetingType}* is scheduled *${reminderText}*.\n\n📋 *Case ID:* ${caseId}\n📆 *Date:* ${dateStr}\n⏰ *Time:* ${time}${linkLine}\n\nPlease be prepared and join on time.\n\n_RaaziMarzi ODR Platform_`;

  return safeSend({ to: phone, message });
};

/* ════════════════════════════════════════════════════════════════
   4. MEETING RESCHEDULED
════════════════════════════════════════════════════════════════ */
export const sendMeetingRescheduledWA = async ({ phone, name, caseId, meetingType, newDate, newTime, joinLink }) => {
  const dateStr  = new Date(newDate).toDateString();
  const linkLine = joinLink ? `\n🔗 *Join:* ${joinLink}` : "";

  const message = `🔄 *Meeting Rescheduled — RaaziMarzi*\n\nDear ${name},\n\nYour *${meetingType}* for case *${caseId}* has been rescheduled.\n\n📆 *New Date:* ${dateStr}\n⏰ *New Time:* ${newTime}${linkLine}\n\nPlease update your calendar.\n\n_RaaziMarzi ODR Platform_`;

  return safeSend({ to: phone, message });
};

/* ════════════════════════════════════════════════════════════════
   5. MEETING CANCELLED
════════════════════════════════════════════════════════════════ */
export const sendMeetingCancelledWA = async ({ phone, name, caseId, meetingType, reason }) => {
  const message = `❌ *Meeting Cancelled — RaaziMarzi*\n\nDear ${name},\n\nThe *${meetingType}* for case *${caseId}* has been cancelled.\n\n📝 *Reason:* ${reason || "Cancelled by case manager"}\n\nYou will be notified when a new meeting is scheduled.\n\n_RaaziMarzi ODR Platform_`;

  return safeSend({ to: phone, message });
};

/* ════════════════════════════════════════════════════════════════
   BULK SEND — send to multiple recipients at once
   Used internally by notification functions
════════════════════════════════════════════════════════════════ */
export const sendBulkWA = async (recipients) => {
  // recipients = [{ phone, message }, ...]
  const results = await Promise.allSettled(
    recipients.map(r => safeSend({ to: r.phone, message: r.message }))
  );
  return results;
};

/* ════════════════════════════════════════════════════════════════
   TEST — verify Twilio connection
════════════════════════════════════════════════════════════════ */
export const testTwilio = async () => {
  try {
    const c = getClient();
    const account = await c.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log(`✅ Twilio connected — Account: ${account.friendlyName}`);
    return true;
  } catch (err) {
    console.error("❌ Twilio connection failed:", err.message);
    return false;
  }
};