const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

const sendMail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Email configuration is missing. Set SMTP_USER, SMTP_PASS, and SMTP_HOST (or EMAIL_USER, EMAIL_PASS, EMAIL_HOST).');
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER,
    to,
    subject,
    html
  });

  return true;
};

module.exports = { sendMail };
