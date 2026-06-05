const Enquiry = require('../models/Enquiry');
const { sendMail } = require('../utils/mailer');

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const subject = `New Student Registration: ${enquiry.name}`;
      const html = `
        <h2>New Student Registration</h2>
        <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
        <p><strong>Course:</strong> ${escapeHtml(enquiry.course)}</p>
        <p><strong>Grade:</strong> ${escapeHtml(enquiry.grade || 'N/A')}</p>
        <p><strong>Board:</strong> ${escapeHtml(enquiry.board || 'N/A')}</p>
        <p><strong>Message:</strong> ${escapeHtml(enquiry.message || 'N/A')}</p>
      `;
      sendMail({ to: adminEmail, subject, html }).catch(() => {});
    }

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', data: enquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const { status, course, priority, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (course) filter.course = course;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.replyToEnquiry = async (req, res) => {
  try {
    const { message } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });

    enquiry.replies.push({ message, repliedBy: req.admin.name });
    enquiry.status = 'replied';
    await enquiry.save();

    res.json({ success: true, message: 'Reply added.', data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();
    const newCount = await Enquiry.countDocuments({ status: 'new' });
    const inProgress = await Enquiry.countDocuments({ status: 'in-progress' });
    const enrolled = await Enquiry.countDocuments({ status: 'enrolled' });
    const replied = await Enquiry.countDocuments({ status: 'replied' });

    const byCourse = await Enquiry.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byMonth = await Enquiry.aggregate([
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.json({ success: true, data: { total, newCount, inProgress, enrolled, replied, byCourse, byMonth } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
