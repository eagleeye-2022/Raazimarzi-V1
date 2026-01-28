import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("\n🧪 Testing SMTP Configuration...\n");

// Display current configuration (without exposing password)
console.log("📋 Current Configuration:");
console.log("   EMAIL_HOST:", process.env.EMAIL_HOST || "❌ NOT SET");
console.log("   EMAIL_PORT:", process.env.EMAIL_PORT || "❌ NOT SET");
console.log("   EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT SET");
console.log("   EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ SET (***hidden***)" : "❌ NOT SET");
console.log("   ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "❌ NOT SET");
console.log("");

// Check if all required variables are set
const missingVars = [];
if (!process.env.EMAIL_HOST) missingVars.push("EMAIL_HOST");
if (!process.env.EMAIL_PORT) missingVars.push("EMAIL_PORT");
if (!process.env.EMAIL_USER) missingVars.push("EMAIL_USER");
if (!process.env.EMAIL_PASS) missingVars.push("EMAIL_PASS");

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error("\nPlease set these in your .env file and try again.\n");
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  },
  debug: true, // Enable debug output
  logger: true // Enable logging
});

async function testSMTP() {
  try {
    console.log("🔌 Step 1: Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!\n");

    console.log("📧 Step 2: Sending test email...");
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'RaaziMarzi'}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: "✅ SMTP Test - RaaziMarzi Server",
      text: "Congratulations! Your SMTP configuration is working correctly.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">✅ SMTP Test Successful!</h2>
          <p>Congratulations! Your SMTP configuration is working correctly.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>Host: ${process.env.EMAIL_HOST}</li>
            <li>Port: ${process.env.EMAIL_PORT}</li>
            <li>From: ${process.env.EMAIL_USER}</li>
          </ul>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated test email from your RaaziMarzi server.
          </p>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   Preview URL:", nodemailer.getTestMessageUrl(info) || "N/A");
    console.log("\n📬 Check your inbox at:", process.env.EMAIL_USER);
    console.log("\n🎉 All tests passed! Your SMTP is configured correctly.\n");
    
  } catch (error) {
    console.error("\n❌ SMTP Test Failed!\n");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error("\n💡 Troubleshooting Tips:");
    
    if (error.code === 'ECONNREFUSED') {
      console.error("   • Check if EMAIL_HOST is correct (should be smtp.zoho.in or smtp.zoho.com)");
      console.error("   • Verify EMAIL_PORT (465 for SSL, 587 for TLS)");
      console.error("   • Make sure .env file is in the root directory");
      console.error("   • Restart your server after changing .env");
    } else if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.error("   • Invalid email or password");
      console.error("   • If 2FA is enabled, use an app-specific password");
      console.error("   • Generate app password at: https://accounts.zoho.in/home#security/app-passwords");
    } else if (error.code === 'ETIMEDOUT') {
      console.error("   • Connection timeout - check your firewall");
      console.error("   • Try using port 587 instead of 465");
      console.error("   • Verify NeevCloud allows outbound SMTP");
    } else {
      console.error("   • See full error details above");
      console.error("   • Check SMTP_TROUBLESHOOTING.md for more help");
    }
    
    console.error("\n");
    process.exit(1);
  }
}

// Run the test
testSMTP();