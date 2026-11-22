const express = require('express');
const router = express.Router();
const { getEmails, getEmailById, syncEmails, analyzeEmail } = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

router.use(protect); // All email routes require auth

router.get('/', getEmails);
router.post('/sync', syncEmails);
router.get('/:id', getEmailById);
router.post('/:id/analyze', analyzeEmail);

module.exports = router;
