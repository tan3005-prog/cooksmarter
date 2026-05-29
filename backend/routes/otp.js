// api/otp.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Simple in-memory OTP store: { targetEmail: { code, expiresAt } }
// Note: for production use a persistent store (Redis) and rate-limiting.
const otpStore = new Map();

// Transport configuration uses env vars for SMTP provider settings.
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || process.env.COOKSMART_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS || process.env.COOKSMART_EMAIL_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || `CookSmart <${SMTP_USER || 'no-reply@example.com'}>`;

if (!SMTP_USER || !SMTP_PASS) {
  console.warn('SMTP_USER or SMTP_PASS not configured; email OTP endpoints will not send mails.');
}

// Function to create a fresh transporter for each email (prevents timeout issues)
function getTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/otp/send-email { email }
router.post('/send-email', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required' });

    const code = generateOtp();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    otpStore.set(email, { code, expiresAt });

    // send email if configured, otherwise just return code for dev
    if (COOK_EMAIL && COOK_PASS) {
      const transporter = getTransporter();
      const info = await transporter.sendMail({
        from: `CookSmart <${COOK_EMAIL}>`,
        to: email,
        subject: 'Your CookSmart verification code',
        text: `Your verification code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your verification code is <b>${code}</b>. It expires in 10 minutes.</p>`
      });
      return res.json({ success: true, message: 'OTP sent', info });
    }

    // not configured: return code for convenience in dev
    return res.json({ success: true, message: 'OTP generated (dev)', code });
  } catch (err) {
    console.error('send-email error', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/otp/verify { email, code }
router.post('/verify', (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const entry = otpStore.get(email);
    if (!entry) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (Date.now() > entry.expiresAt) { otpStore.delete(email); return res.status(400).json({ error: 'OTP expired' }); }
    if (entry.code !== String(code)) return res.status(400).json({ error: 'Invalid OTP' });

    // success: remove OTP and return success
    otpStore.delete(email);
    return res.json({ success: true, message: 'Verified' });
  } catch (err) {
    console.error('verify error', err);
    res.status(500).json({ error: 'OTP verify failed' });
  }
});

module.exports = router;
