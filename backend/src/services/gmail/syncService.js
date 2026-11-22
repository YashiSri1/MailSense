const { getGmailClient } = require('./oauthService');
const Email = require('../../models/Email');
const User = require('../../models/User');
const { classifyEmail } = require('../ai/emailClassifier');
const { extractActions } = require('../ai/actionExtractor');
const { summarizeEmail } = require('../ai/emailSummarizer');

const syncEmailsForUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.googleTokens) {
    throw new Error('User has not connected Gmail');
  }

  const gmail = getGmailClient(user.googleTokens);

  // Fetch the latest 10 emails for demo purposes
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
    labelIds: ['INBOX'],
  });

  const messages = res.data.messages || [];
  let syncedCount = 0;

  for (const message of messages) {
    // Check if email already exists
    const exists = await Email.findOne({ providerMessageId: message.id, userId });
    if (exists) continue;

    const msgDetail = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
      format: 'metadata',
      metadataHeaders: ['Subject', 'From', 'Date'],
    });

    const headers = msgDetail.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
    const fromHeader = headers.find(h => h.name === 'From')?.value || '';
    const dateStr = headers.find(h => h.name === 'Date')?.value;

    let senderName = fromHeader;
    let senderEmail = fromHeader;
    const match = fromHeader.match(/(.*)<(.*)>/);
    if (match) {
      senderName = match[1].trim() || match[2].trim();
      senderEmail = match[2].trim();
    }

    const email = await Email.create({
      userId,
      providerMessageId: message.id,
      threadId: msgDetail.data.threadId,
      sender: senderName.replace(/"/g, ''),
      senderEmail: senderEmail,
      subject,
      snippet: msgDetail.data.snippet,
      receivedAt: dateStr ? new Date(dateStr) : new Date(),
      labels: msgDetail.data.labelIds,
      category: 'OTHER',
      priority: 'LOW',
    });

    if (!process.env.AI_API_KEY || process.env.AI_API_KEY === 'your_ai_api_key') {
      const classification = await classifyEmail(email);
      const extraction = await extractActions(email);
      const summaryData = await summarizeEmail(email);
      const priorityScore = classification.priority === 'CRITICAL' ? 80
        : classification.priority === 'HIGH' ? 60
          : classification.priority === 'MEDIUM' ? 40 : 10;

      email.category = classification.category || email.category;
      email.priority = classification.priority || email.priority;
      email.intent = classification.intent || email.intent;
      email.confidence = classification.confidence || email.confidence;
      email.requiresAction = extraction.requiresAction || false;
      email.requiresResponse = extraction.requiresResponse || false;
      email.action = extraction.action || null;
      email.deadline = extraction.deadline ? new Date(extraction.deadline) : null;
      email.summary = summaryData.summary || email.summary;
      email.priorityScore = Math.min(
        100,
        priorityScore
          + (email.requiresAction ? 10 : 0)
          + (email.requiresResponse ? 10 : 0)
          + (email.deadline ? 15 : 0)
      );
      email.isImportant = email.priorityScore >= 60;
      await email.save();
    }

    syncedCount++;
  }

  return { message: `Synced ${syncedCount} new emails.` };
};

module.exports = {
  syncEmailsForUser
};
