const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/send-email', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required' });

    const code = generateOtp();
    const expiresAt = Date.now() + (10 * 60 * 1000);
    otpStore.set(email, { code, expiresAt });

    await sgMail.send({
      to: email,                          // ✅ any email works!
      from: 'wethecooksmart@gmail.com',   // ← must verify this in SendGrid
      subject: 'Your CookSmart verification code',
      html: `<p>Your verification code is <b>${code}</b>. It expires in 10 minutes.</p>`
    });

    return res.json({ success: true, message: 'OTP sent' });

  } catch (err) {
    console.error('send-email error', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// verify route stays exactly the same
router.post('/verify', (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const entry = otpStore.get(email);
    if (!entry) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (Date.now() > entry.expiresAt) { otpStore.delete(email); return res.status(400).json({ error: 'OTP expired' }); }
    if (entry.code !== String(code)) return res.status(400).json({ error: 'Invalid OTP' });

    otpStore.delete(email);
    return res.json({ success: true, message: 'Verified' });

  } catch (err) {
    console.error('verify error', err);
    res.status(500).json({ error: 'OTP verify failed' });
  }
});

module.exports = router;