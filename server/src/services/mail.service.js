import nodemailer from "nodemailer";

// ✅ Create transporter (Zoho-safe)
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true, // MUST be true for Zoho
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be Zoho App Password
  },
});

// ✅ Manual SMTP test (call explicitly)
export const testSMTP = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP server is ready");
    return true;
  } catch (error) {
    console.error("❌ SMTP verification failed:", error.message);
    return false;
  }
};

// ✅ Send OTP Email
export const sendOtpMail = async ({ email, otp, type }) => {
  const subject =
    type === "signup"
      ? "Your Signup OTP - RaaziMarzi"
      : "Your Password Reset OTP - RaaziMarzi";

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "RaaziMarzi"}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <h2>${subject}</h2>
      <p>Your OTP:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes.</p>
    `,
  });
};

// Contact mail
export const sendContactMail = async ({ name, email, phone, message }) => {
  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Contact Request - RaaziMarzi",
    html: `
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "N/A"}</p>
      <p>${message}</p>
    `,
  });
};

// Demo mail
export const sendDemoMail = async ({ name, email, phone, company, message }) => {
  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Demo Request - RaaziMarzi",
    html: `
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Company:</b> ${company}</p>
      <p>${message}</p>
    `,
  });
};

export default transporter;
