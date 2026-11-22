const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // All task routes require auth

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);

module.exports = router;
