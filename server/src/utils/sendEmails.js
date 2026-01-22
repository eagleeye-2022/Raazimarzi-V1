import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"RaaziMarzi" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset OTP",
    html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 10 minutes</p>`,
  });
};
