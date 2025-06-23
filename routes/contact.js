const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5 // limit each IP to 5 requests per hour
});

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Submit contact form
router.post('/submit', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create new contact entry
    const contact = new Contact({
      name,
      email,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    await contact.save();

    // Send notification email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>IP Address:</strong> ${req.ip}</p>
        <p><strong>User Agent:</strong> ${req.headers['user-agent']}</p>
      `
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
});

// Get all contact submissions (admin only)
router.get('/all', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
});

// Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.status = status;
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact status', error: error.message });
  }
});

// Add response to contact
router.post('/:id/respond', async (req, res) => {
  try {
    const { message } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.addResponse(message);

    // Send response email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: contact.email,
      subject: 'Re: Your Message to Mr. Ransomware',
      html: `
        <p>Dear ${contact.name},</p>
        <p>${message}</p>
        <p>Best regards,<br>Mr. Ransomware</p>
      `
    });

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to contact', error: error.message });
  }
});

module.exports = router; 