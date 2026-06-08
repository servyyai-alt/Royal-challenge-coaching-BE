const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      address: '#25, Uthiramatha Koil Street, Old Town, Vellore.',
      landmark: 'Near Arulmigu Mariyamman And Padavettamman Thirukovil',
      phone: '94860 91662',
      email: 'velloreroyalcoaching@gmail.com',
      website: 'www.royalcoachingcenter.com',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.000000000000!2d79.13!3d12.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzEyLjAiTiA3OcKwMDcnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890',
      hours: {
        weekdays: '7:00 AM – 8:00 PM',
        saturday: '7:00 AM – 6:00 PM',
        sunday: '9:00 AM – 1:00 PM'
      },
      social: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        whatsapp: 'https://wa.me/919486091662'
      }
    }
  });
});

module.exports = router;
