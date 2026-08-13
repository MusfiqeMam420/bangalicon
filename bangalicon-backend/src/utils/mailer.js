const nodemailer = require("nodemailer");

const hasSmtpConfig = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const getMailFrom = () =>
  process.env.MAIL_FROM || process.env.SMTP_USER || "sammobadi1925@gmail.com";

const sendMail = async ({ to, subject, html, text }) => {
  if (!hasSmtpConfig()) {
    console.warn("[mailer] SMTP is not configured. Email was not sent.");
    return {
      delivered: false,
      reason: "smtp_not_configured",
    };
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: getMailFrom(),
    to,
    subject,
    text,
    html,
  });

  return {
    delivered: true,
  };
};

module.exports = {
  hasSmtpConfig,
  sendMail,
  getMailFrom,
};
