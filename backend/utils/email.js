const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Email template wrapper
const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0066ff, #00c9ff); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; }
    .body { padding: 32px; color: #333; }
    .body h2 { font-size: 22px; color: #0066ff; margin-top: 0; }
    .otp-box { background: linear-gradient(135deg, #f0f7ff, #e0f0ff); border: 2px dashed #0066ff; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp { font-size: 40px; font-weight: 800; color: #0066ff; letter-spacing: 8px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #0066ff, #00c9ff); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 16px 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #eee; }
    .tag { background: #e0f0ff; color: #0066ff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 MediConnect AI</h1>
      <p>Your Premium Healthcare Platform</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© 2024 MediConnect AI. All rights reserved.</p>
      <p>This email was sent automatically. Please do not reply.</p>
    </div>
  </div>
</body>
</html>`;

// Send OTP Email
exports.sendOTPEmail = async (email, name, otp) => {
  const transporter = createTransporter();
  const content = `
    <h2>Hello, ${name}! 👋</h2>
    <p>Your One-Time Password (OTP) for MediConnect AI is:</p>
    <div class="otp-box">
      <div class="otp">${otp}</div>
      <p style="color:#666; margin:8px 0 0; font-size:14px;">Valid for <strong>10 minutes</strong></p>
    </div>
    <p>If you did not request this OTP, please ignore this email and your account will remain secure.</p>
  `;
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: '🔐 Your MediConnect AI OTP Code',
    html: emailTemplate(content),
  });
};

// Send Appointment Confirmation
exports.sendAppointmentConfirmation = async (email, name, appointmentData) => {
  const transporter = createTransporter();
  const content = `
    <h2>Appointment Confirmed! ✅</h2>
    <p>Dear <strong>${name}</strong>, your appointment has been successfully booked.</p>
    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <tr style="background:#f0f7ff;"><td style="padding:12px; font-weight:600;">Doctor</td><td style="padding:12px;">${appointmentData.doctorName}</td></tr>
      <tr><td style="padding:12px; font-weight:600;">Department</td><td style="padding:12px;">${appointmentData.department}</td></tr>
      <tr style="background:#f0f7ff;"><td style="padding:12px; font-weight:600;">Date</td><td style="padding:12px;">${appointmentData.date}</td></tr>
      <tr><td style="padding:12px; font-weight:600;">Time</td><td style="padding:12px;">${appointmentData.time}</td></tr>
      <tr style="background:#f0f7ff;"><td style="padding:12px; font-weight:600;">Type</td><td style="padding:12px;"><span class="tag">${appointmentData.type}</span></td></tr>
    </table>
    <p>Please arrive 15 minutes before your scheduled time.</p>
  `;
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: '✅ Appointment Confirmed - MediConnect AI',
    html: emailTemplate(content),
  });
};

// Send Password Reset Email
exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
  const transporter = createTransporter();
  const content = `
    <h2>Reset Your Password 🔑</h2>
    <p>Dear <strong>${name}</strong>, you requested to reset your password.</p>
    <p>Click the button below to reset it. This link will expire in <strong>30 minutes</strong>.</p>
    <div style="text-align:center; margin:32px 0;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    <p style="color:#888; font-size:13px;">If you did not request a password reset, ignore this email.</p>
  `;
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: '🔑 Password Reset - MediConnect AI',
    html: emailTemplate(content),
  });
};
