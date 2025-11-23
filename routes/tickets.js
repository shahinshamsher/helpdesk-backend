const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const Ticket = require('../models/Ticket');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { sendNotification } = require('../utils/notify');

// create ticket
router.post('/', auth, async (req,res)=>{
  try {
    const { title, description, priority } = req.body;
    const t = new Ticket({ title, description, priority, owner: req.user._id });
    await t.save();
    await Activity.create({ action: 'create_ticket', ticket: t._id, by: req.user._id, details: title });
    sendNotification({ to: req.user.email, subject: 'Ticket created', message: `Your ticket "${title}" created.`});
    res.json(t);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// list tickets (with basic q/status filter)
router.get('/', auth, async (req,res)=>{
  const { q, status } = req.query;
  const filter = {};
  if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
  if (status) filter.status = status;

  // if user is normal user, only their tickets
  if (req.user.role === 'user') filter.owner = req.user._id;
  if (req.user.role === 'agent') filter.assignedTo = req.user._id;

  const tickets = await Ticket.find(filter)
    .populate('owner','name email')
    .populate('assignedTo','name email')
    .sort({ createdAt: -1 });

  // map to simplified shape for frontend
  const mapped = tickets.map(t => ({
    ...t.toObject(),
    ownerName: t.owner?.name,
    assignedToName: t.assignedTo?.name
  }));

  res.json(mapped);
});

// get summary + chart data
router.get('/summary', auth, async (req,res)=>{
  const totalOpen = await Ticket.countDocuments({ status: 'open' });
  const totalResolved = await Ticket.countDocuments({ status: 'resolved' });
  const assigned = await Ticket.countDocuments({ assignedTo: { $ne: null }});
  // simple chart: count per priority
  const priorities = ['low','medium','high'];
  const labels = priorities;
  const data = await Promise.all(priorities.map(p => Ticket.countDocuments({ priority: p })));
  res.json({ summary: { active: totalOpen, solved: totalResolved, assigned }, chart: { labels, data }});
});

// get single ticket + history
router.get('/:id', auth, async (req,res)=>{
  const t = await Ticket.findById(req.params.id).populate('owner','name email').populate('assignedTo','name email');
  if (!t) return res.status(404).json({ message: 'Not found' });
  // access: user can view only own
  if (req.user.role === 'user' && t.owner._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  res.json(t);
});

// update status / add note (agent/admin)
router.put('/:id', auth, async (req,res)=>{
  const { status, note } = req.body;
  const t = await Ticket.findById(req.params.id);
  if (!t) return res.status(404).json({ message: 'Not found' });

  // users can withdraw their ticket
  if (status === 'withdrawn') {
    if (req.user.role !== 'user' || t.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only owner can withdraw' });
    t.status = 'withdrawn';
    t.history.push({ message: 'Ticket withdrawn', by: req.user._id, date: new Date()});
    await t.save();
    await Activity.create({ action: 'withdraw', ticket: t._id, by: req.user._id, details: 'withdrawn' });
    return res.json(t);
  }

  // agent/admin can change status or add note
  if (req.user.role === 'agent' || req.user.role === 'admin') {
    if (status) t.status = status;
    if (note) t.history.push({ message: note, by: req.user._id, date: new Date()});
    await t.save();
    await Activity.create({ action: 'update_ticket', ticket: t._id, by: req.user._id, details: status || note });
    if (t.owner) {
      const owner = await User.findById(t.owner);
      sendNotification({ to: owner.email, subject: `Ticket ${t.title} updated`, message: `Status: ${t.status}`});
    }
    return res.json(t);
  }

  res.status(403).json({ message: 'Forbidden' });
});

module.exports = router;
