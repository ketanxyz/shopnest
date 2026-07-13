const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { getAdminstats } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/', protect, admin, getAdminstats);


module.exports = router;