import nodemailer from "nodemailer";
import { env } from "../config/env.ts";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export interface SendCredentialsOptions {
  to: string;
  nama: string;
  email: string;
  password: string;
}

export const mailer = {
  async sendNewUserCredentials(opts: SendCredentialsOptions): Promise<void> {
    await transporter.sendMail({
      from: `"AB Medical" <${env.mailFrom}>`,
      to: opts.to,
      subject: "Detail Akun AB Medical Anda",
      html: `
        <p>Halo <strong>${opts.nama}</strong>,</p>
        <p>Akun Anda di sistem AB Medical telah dibuat. Berikut detail login Anda:</p>
        <table cellpadding="6" cellspacing="0">
          <tr><td><strong>Email</strong></td><td>: ${opts.email}</td></tr>
          <tr><td><strong>Password</strong></td><td>: ${opts.password}</td></tr>
        </table>
        <p>Segera ganti password Anda setelah login pertama.</p>
        <p>Salam,<br/>Tim AB Medical</p>
      `,
    });
  },
};

