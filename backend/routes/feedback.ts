// backend/routes/feedback.ts
// Express router for patient feedback submission and review collection

import { Router } from 'express';
import { feedbackList, FeedbackItem } from '../db/data.js';

const router = Router();

// Submit feedback
router.post('/', (req, res) => {
  const { userId, userName, role, rating, category, comment } = req.body;
  const newItem: FeedbackItem = {
    id: `fb-${Date.now()}`,
    userId: userId || 'pat-1',
    userName: userName || 'Anonymous Patient',
    role: role || 'patient',
    rating: Number(rating) || 5,
    category: category || 'General',
    comment: comment || 'Great application experience!',
    createdAt: new Date().toISOString(),
  };
  feedbackList.unshift(newItem);
  return res.json(newItem);
});

// List all feedback
router.get('/', (req, res) => {
  return res.json(feedbackList);
});

export default router;
