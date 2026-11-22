const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerMessageId: { type: String, required: true },
  threadId: { type: String },
  sender: { type: String, required: true },
  senderEmail: { type: String },
  subject: { type: String, default: '(No Subject)' },
  snippet: { type: String },
  body: { type: String },
  receivedAt: { type: Date, required: true },
  labels: [{ type: String }],
  
  // AI fields
  category: { 
    type: String, 
    enum: ['CAREER', 'EDUCATION', 'FINANCE', 'HEALTH', 'PERSONAL', 'WORK', 'MEETING', 'SHOPPING', 'PROMOTION', 'NEWSLETTER', 'SOCIAL', 'SECURITY', 'TRAVEL', 'OTHER'],
    default: 'OTHER'
  },
  priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'LOW' },
  priorityScore: { type: Number, default: 0 },
  summary: { type: String },
  intent: { type: String },
  requiresAction: { type: Boolean, default: false },
  requiresResponse: { type: Boolean, default: false },
  action: { type: String },
  deadline: { type: Date },
  confidence: { type: Number, default: 0 },

  // State
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isImportant: { type: Boolean, default: false },

}, { timestamps: true });

// Indexes for common queries
emailSchema.index({ userId: 1, receivedAt: -1 });
emailSchema.index({ userId: 1, category: 1 });
emailSchema.index({ userId: 1, priority: 1 });

module.exports = mongoose.model('Email', emailSchema);
