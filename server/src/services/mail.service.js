import nodemailer from "nodemailer";

const validateEmailEnv = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL CONFIG ERROR:");
    console.error("   EMAIL_USER or EMAIL_PASS is missing in .env");
    return false;
  }
  return true;
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (!validateEmailEnv()) {
      throw new Error("Email credentials not configured");
    }

    console.log("📧 Initializing Zoho SMTP transporter...");

    // ✅ Use .env configuration instead of hardcoded values
    const port = parseInt(process.env.EMAIL_PORT) || 587;
    const secure = process.env.EMAIL_SECURE === "true" || port === 465;

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.zoho.in",
      port: port,
      secure: secure, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true,
    });

    console.log(`   Using port ${port} (secure: ${secure})`);
  }

  return transporter;
};


export const testSMTP = async () => {
  try {
    console.log("\n🔍 Verifying SMTP credentials...");
    console.log("   User:", process.env.EMAIL_USER);
    console.log(
      "   Pass:",
      process.env.EMAIL_PASS
        ? "✅ Set (***" + process.env.EMAIL_PASS.slice(-4) + ")"
        : "❌ NOT SET"
    );

    const smtp = getTransporter();
    await smtp.verify();

    console.log("✅ Zoho SMTP authentication successful!");
    return true;
  } catch (error) {
    console.error("\n❌ SMTP verification failed!");
    console.error("   Message:", error.message);
    console.error("   Code:", error.code || "N/A");

    if (error.code === "EAUTH") {
      console.error("💡 AUTH FIX:");
      console.error("   - Use Zoho App Password (not email password)");
      console.error("   - Remove spaces from password");
      console.error("   - Regenerate App Password if needed");
    }

    return false;
  }
};

/**
 * 📩 Send OTP Email
 */
export const sendOtpMail = async ({ email, otp, type }) => {
  try {
    const smtp = getTransporter();

    const subject =
      type === "signup"
        ? "Your Signup OTP - RaaziMarzi"
        : "Your Password Reset OTP - RaaziMarzi";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; padding:20px; }
    .box { max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; }
    .header { background:#667eea; color:#fff; padding:30px; text-align:center; }
    .content { padding:30px; color:#333; }
    .otp { font-size:32px; letter-spacing:6px; font-weight:bold; color:#667eea; text-align:center; margin:20px 0; }
    .footer { background:#f8f9fa; padding:15px; font-size:12px; color:#777; text-align:center; }
  </style>
</head>
<body>
  <div class="box">
    <div class="header">
      <h2>${subject}</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for <strong>5 minutes</strong>.</p>
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} RaaziMarzi. Do not reply.
    </div>
  </div>
</body>
</html>
`;

    const info = await smtp.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "RaaziMarzi"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    console.log("✅ OTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ OTP send failed:", error.message);
    throw error;
  }
};

/**
 * 📬 Contact Mail
 */
export const sendContactMail = async ({ name, email, phone, message }) => {
  const smtp = getTransporter();

  await smtp.sendMail({
    from: `"RaaziMarzi" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: "New Contact Request - RaaziMarzi",
    html: `
      <h3>New Contact Request</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "N/A"}</p>
      <p><b>Message:</b><br/>${message}</p>
    `,
  });

  console.log("✅ Contact mail sent");
};


export const sendDemoMail = async ({ name, email, phone, company, message }) => {
  const smtp = getTransporter();

  await smtp.sendMail({
    from: `"RaaziMarzi" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: "New Demo Request - RaaziMarzi",
    html: `
      <h3>New Demo Request</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Company:</b> ${company}</p>
      <p><b>Message:</b><br/>${message}</p>
    `,
  });

  console.log("✅ Demo mail sent");
};

export default getTransporter;
