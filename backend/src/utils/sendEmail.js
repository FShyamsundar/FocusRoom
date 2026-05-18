import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("SMTP not configured. Skipping email delivery.");
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || "FocusRoom <noreply@focusroom.app>",
    to,
    subject,
    html,
  });
};

