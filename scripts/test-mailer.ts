import { mailer } from "../src/lib/mailer.ts";
import nodemailer from "nodemailer";
import { env } from "../src/config/env.ts";

async function main() {
  console.log("Checking SMTP configuration:");
  console.log("Host:", env.smtpHost);
  console.log("Port:", env.smtpPort);
  console.log("User:", env.smtpUser);
  console.log("From:", env.mailFrom);

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  console.log("\n1. Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("Connection verified successfully.");
  } catch (err) {
    console.error("Transporter verify failed:", err);
    return;
  }

  const targetEmail = process.argv[2] || env.mailFrom;
  console.log(`\n2. Sending test email to: ${targetEmail}`);
  try {
    const info = await transporter.sendMail({
      from: `"AB Medical" <${env.mailFrom}>`,
      to: targetEmail,
      subject: "Test Email from AB Medical",
      text: "If you receieved this message, then Nodemailer and Brevo configuration completed successfully.",
    });
    console.log("Email sent successfully.");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (err) {
    console.error("Send email failed:", err);
  }
}

main();

