const Admin = require('../models/Admin');

const seed = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@royalcoachingcentre.com' });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@royalcoachingcentre.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'superadmin'
      });
      console.log('✅ Admin account seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seed;
