const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id, status: { $ne: 'DISMISSED' } })
      .populate('emailId', 'subject sender')
      .sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, emailId, source } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const normalizedPriority = ['HIGH', 'MEDIUM', 'LOW'].includes(priority)
      ? priority
      : priority === 'CRITICAL'
        ? 'HIGH'
        : 'MEDIUM';

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description,
      dueDate,
      priority: normalizedPriority,
      emailId,
      source: source || 'MANUAL'
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task (e.g. mark as completed)
// @route   PATCH /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { status, title, dueDate } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (status) task.status = status;
    if (title) task.title = title;
    if (dueDate) task.dueDate = dueDate;

    if (status === 'COMPLETED' && !task.completedAt) {
      task.completedAt = new Date();
    }
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
