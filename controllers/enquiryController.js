const Enquiry = require('../models/Enquiry');

exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
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
