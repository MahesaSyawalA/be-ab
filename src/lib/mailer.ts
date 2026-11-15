import nodemailer from "nodemailer";
import { env } from "../config/env.ts";
import { buildNewUserHtml, type NewUserEmailData } from "./email-templates.ts";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export interface SendCredentialsOptions extends NewUserEmailData {
  to: string;
}

export const mailer = {
  async sendNewUserCredentials(opts: SendCredentialsOptions): Promise<void> {
    const html = buildNewUserHtml({
      nama: opts.nama,
      email: opts.email,
      password: opts.password,
      role: opts.role,
      loginUrl: opts.loginUrl || env.corsOrigins[0],
    });

    await transporter.sendMail({
      from: `"AB Medical" <${env.mailFrom}>`,
      to: opts.to,
      subject: "Selamat Datang di AB Medical - Detail Akun Anda",
      html,
    });
  },
};

