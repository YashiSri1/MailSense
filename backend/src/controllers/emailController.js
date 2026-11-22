const Email = require('../models/Email');
const { syncEmailsForUser } = require('../services/gmail/syncService');
const { classifyEmail } = require('../services/ai/emailClassifier');
const { extractActions } = require('../services/ai/actionExtractor');
const { summarizeEmail } = require('../services/ai/emailSummarizer');

// @desc    Sync emails from Gmail
// @route   GET /api/emails
// @access  Private
exports.getEmails = async (req, res) => {
  try {
    const { category, priority, isRead, search, page = 1, limit = 20 } = req.query;
    let query = { userId: req.user._id };

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { sender: { $regex: search, $options: 'i' } },
        { snippet: { $regex: search, $options: 'i' } },
      ];
    }

    const emails = await Email.find(query)
      .sort({ receivedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Email.countDocuments(query);

    res.json({
      emails,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single email by ID
// @route   GET /api/emails/:id
// @access  Private
exports.getEmailById = async (req, res) => {
  try {
    const email = await Email.findOne({ _id: req.params.id, userId: req.user._id });
    if (email) {
      res.json(email);
    } else {
      res.status(404).json({ message: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync recent emails from Gmail
// @route   POST /api/emails/sync
// @access  Private
exports.syncEmails = async (req, res) => {
  try {
    const result = await syncEmailsForUser(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze an email using AI
// @route   POST /api/emails/:id/analyze
// @access  Private
exports.analyzeEmail = async (req, res) => {
  try {
    const email = await Email.findOne({ _id: req.params.id, userId: req.user._id });
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Run AI analysis
    const classification = await classifyEmail(email);
    const extraction = await extractActions(email);
    const summaryData = await summarizeEmail(email);

    // Calculate heuristic score (0-100)
    let score = classification.priority === 'CRITICAL' ? 80 : classification.priority === 'HIGH' ? 60 : classification.priority === 'MEDIUM' ? 40 : 10;
    if (extraction.requiresAction) score += 10;
    if (extraction.requiresResponse) score += 10;
    if (extraction.deadline) score += 15;
    score = Math.min(100, score);

    // Update email record
    email.category = classification.category || email.category;
    email.priority = classification.priority || email.priority;
    email.intent = classification.intent || email.intent;
    email.confidence = classification.confidence || email.confidence;
    email.requiresAction = extraction.requiresAction || false;
    email.requiresResponse = extraction.requiresResponse || false;
    email.action = extraction.action || null;
    email.deadline = extraction.deadline ? new Date(extraction.deadline) : null;
    email.summary = summaryData.summary || email.summary;
    email.priorityScore = score;
    email.isImportant = score >= 60;

    await email.save();

    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


