const Email = require('../models/Email');
const Task = require('../models/Task');
const { analyzeWithLLM } = require('../services/ai/aiService');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [
      urgentCount,
      importantCount,
      responsesNeeded,
      upcomingTasks,
      recentImportantEmails
    ] = await Promise.all([
      Email.countDocuments({ userId, priority: 'CRITICAL' }),
      Email.countDocuments({ userId, isImportant: true }),
      Email.countDocuments({ userId, requiresResponse: true }),
      Task.countDocuments({ userId, status: { $ne: 'COMPLETED' }, dueDate: { $lte: endOfDay } }),
      Email.find({ userId, isImportant: true }).sort({ receivedAt: -1 }).limit(5)
    ]);

    res.json({
      urgentCount,
      importantCount,
      responsesNeeded,
      upcomingTasks,
      recentImportantEmails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const categoryDist = await Email.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const priorityDist = await Email.aggregate([
      { $match: { userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const totalEmails = await Email.countDocuments({ userId });
    const actionRequiredCount = await Email.countDocuments({ userId, requiresAction: true });
    const responseRequiredCount = await Email.countDocuments({ userId, requiresResponse: true });

    res.json({
      categoryDistribution: categoryDist.map(d => ({ name: d._id, value: d.count })),
      priorityDistribution: priorityDist.map(d => ({ name: d._id, value: d.count })),
      totalEmails,
      actionRequiredCount,
      responseRequiredCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.naturalLanguageSearch = async (req, res) => {
  try {
    const { query } = req.body;
    
    const schema = {
      name: 'StructuredSearch',
      type: 'object',
      properties: {
        category: { type: 'string', nullable: true },
        priority: { type: 'string', nullable: true },
        requiresResponse: { type: 'boolean', nullable: true }
      }
    };

    let dbQuery = { userId: req.user._id };
    
    // Heuristic parsing for Demo Mode (Mocked NLP)
    const q = query.toLowerCase();
    if (q.includes('recruiter') || q.includes('job') || q.includes('interview')) dbQuery.category = 'CAREER';
    if (q.includes('response') || q.includes('reply')) dbQuery.requiresResponse = true;
    if (q.includes('important')) dbQuery.isImportant = true;
    if (q.includes('bill') || q.includes('pay')) dbQuery.category = 'FINANCE';
    
    const emails = await Email.find(dbQuery).sort({ receivedAt: -1 }).limit(20);
    
    res.json({ emails, parsedQuery: dbQuery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
