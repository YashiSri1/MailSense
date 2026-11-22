require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Email = require('../models/Email');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    // Clear DB
    await User.deleteMany();
    await Email.deleteMany();

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@mailsense.app',
      password: 'password123',
    });

    console.log('User created:', user.email);

    const mockEmails = [
      {
        userId: user._id,
        providerMessageId: 'msg1',
        sender: 'Google Recruitment',
        senderEmail: 'recruiting@google.com',
        subject: 'Software Engineering Internship - Interview Invitation',
        snippet: 'Congratulations! We would like to invite you for a technical interview...',
        receivedAt: new Date(),
        category: 'CAREER',
        priority: 'CRITICAL',
        priorityScore: 95,
        summary: 'You have been selected for a technical interview. Please schedule your slot.',
        intent: 'INTERVIEW',
        requiresAction: true,
        action: 'Schedule technical interview slot',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isImportant: true,
      },
      {
        userId: user._id,
        providerMessageId: 'msg2',
        sender: 'Netflix',
        senderEmail: 'info@netflix.com',
        subject: 'Your new monthly statement',
        snippet: 'Your subscription of $15.99 has been processed...',
        receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        category: 'FINANCE',
        priority: 'LOW',
        priorityScore: 10,
        summary: 'Your monthly Netflix subscription has been paid.',
        intent: 'PAYMENT',
      },
      {
        userId: user._id,
        providerMessageId: 'msg3',
        sender: 'Prof. Smith',
        senderEmail: 'smith@university.edu',
        subject: 'Assignment 3 Deadline Extension',
        snippet: 'Dear class, I am extending the deadline for Assignment 3 by two days...',
        receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        category: 'EDUCATION',
        priority: 'HIGH',
        priorityScore: 80,
        summary: 'Assignment 3 deadline has been extended by 2 days.',
        intent: 'INFORMATION',
        requiresAction: false,
        isImportant: true,
      },
      {
        userId: user._id,
        providerMessageId: 'msg4',
        sender: 'Amazon',
        senderEmail: 'promotions@amazon.com',
        subject: 'Big Sale - Up to 50% Off Electronics',
        snippet: 'Don\'t miss out on these amazing deals...',
        receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        category: 'PROMOTION',
        priority: 'LOW',
        priorityScore: 5,
        summary: 'Promotional email for Amazon electronics sale.',
      }
    ];

    await Email.insertMany(mockEmails);
    console.log('Seed data inserted successfully!');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

module.exports = seedData;

