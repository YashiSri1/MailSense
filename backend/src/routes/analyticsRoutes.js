const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics, naturalLanguageSearch } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/', getAnalytics);
router.post('/search', naturalLanguageSearch);

module.exports = router;
