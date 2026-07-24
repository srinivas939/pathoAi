// backend/routes/notifications.ts
// Express router for user system and clinical notification management

import { Router } from 'express';
import { notifications } from '../db/data.js';

const router = Router();

// Get user notifications
router.get('/', (req, res) => {
  const { userId } = req.query;
  let userNotifs = [...notifications];
  if (userId) userNotifs = userNotifs.filter(n => n.userId === userId || n.userId === 'all');
  return res.json(userNotifs);
});

// Mark single notification as read
router.put('/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  return res.json({ success: true });
});

// Mark all notifications read
router.post('/mark-all-read', (req, res) => {
  const { userId } = req.body;
  notifications.forEach(n => {
    if (n.userId === userId || userId === 'all') n.read = true;
  });
  return res.json({ success: true });
});

export default router;
