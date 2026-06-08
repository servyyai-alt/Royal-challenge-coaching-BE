const TutorRegistration = require('../models/TutorRegistration');
const { sendMail } = require('../utils/mailer');

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

exports.createTutorRegistration = async (req, res) => {
  try {
    const tutor = await TutorRegistration.create(req.body);

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER;
    if (adminEmail) {
      const subject = `New Tutor Registration: ${tutor.name}`;
      const html = `
        <h2>New Tutor Registration</h2>
        <p><strong>Name:</strong> ${escapeHtml(tutor.name)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(tutor.interestedInSubjects)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(tutor.phone || tutor.email || 'N/A')}</p>
        <hr />
        <p><strong>Tutor Code:</strong> ${escapeHtml(tutor.tutorCode)}</p>
        <p><strong>Gender/Age:</strong> ${escapeHtml(tutor.genderAge)}</p>
        <p><strong>Teaching Type:</strong> ${escapeHtml(tutor.interestedInTeaching)}</p>
        <p><strong>City:</strong> ${escapeHtml(tutor.city)}</p>
        <p><strong>Area:</strong> ${escapeHtml(tutor.area)}</p>
        <p><strong>Subarea:</strong> ${escapeHtml(tutor.subarea)}</p>
        <p><strong>Preferred Area:</strong> ${escapeHtml(tutor.preferredArea)}</p>
        <p><strong>Experience:</strong> ${escapeHtml(tutor.experienceOfTeaching)}</p>
        <p><strong>Class:</strong> ${escapeHtml(tutor.interestedInClass)}</p>
        <p><strong>Subjects:</strong> ${escapeHtml(tutor.interestedInSubjects)}</p>
        <p><strong>Qualification:</strong> ${escapeHtml(tutor.qualification)}</p>
        <p><strong>Fees Expectation:</strong> ${escapeHtml(tutor.feesExpectation)}</p>
      `;
      void sendMail({ to: adminEmail, subject, html }).catch((mailErr) => {
        console.error('Failed to send tutor registration email:', mailErr.message);
      });
    }

    res.status(201).json({ success: true, message: 'Tutor registration submitted successfully!', data: tutor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllTutorRegistrations = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tutorCode: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { interestedInSubjects: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await TutorRegistration.countDocuments(filter);
    const data = await TutorRegistration.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTutorRegistration = async (req, res) => {
  try {
    const tutor = await TutorRegistration.findById(req.params.id);
    if (!tutor) return res.status(404).json({ success: false, message: 'Tutor registration not found.' });
    res.json({ success: true, data: tutor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTutorRegistration = async (req, res) => {
  try {
    const tutor = await TutorRegistration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tutor) return res.status(404).json({ success: false, message: 'Tutor registration not found.' });
    res.json({ success: true, data: tutor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTutorRegistration = async (req, res) => {
  try {
    await TutorRegistration.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tutor registration deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTutorStats = async (req, res) => {
  try {
    const total = await TutorRegistration.countDocuments();
    const pending = await TutorRegistration.countDocuments({ status: 'pending' });
    const approved = await TutorRegistration.countDocuments({ status: 'approved' });
    const byCity = await TutorRegistration.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: { total, pending, approved, byCity } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
