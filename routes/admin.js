const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Activity = require('../models/Activity');
const { sendNotification } = require('../utils/notify');

/**
 * @route   GET /api/admin/agents
 * @desc    Get list of all agents
 * @access  Admin
 */
router.get('/agents', auth, roles(['admin']), async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json(agents);
  } catch (err) {
    console.error('Error fetching agents:', err);
    res.status(500).json({ message: 'Server error while fetching agents' });
  }
});

/**
 * @route   POST /api/admin/assign
 * @desc    Assign a ticket to an agent
 * @access  Admin
 */
router.post('/assign', auth, roles(['admin']), async (req, res) => {
  try {
    const { ticketId, agentId } = req.body;

    // ✅ Validate input
    if (!ticketId || !agentId) {
      return res.status(400).json({ message: 'Ticket ID and Agent ID are required' });
    }

    // ✅ Check ticket existence
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // ✅ Check agent existence and role
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ message: 'Invalid agent ID' });
    }

    // ✅ Update ticket
    ticket.assignedTo = agentId;
    ticket.status = 'in_progress';
    await ticket.save();

    // ✅ Log activity
    await Activity.create({
      action: 'assign',
      ticket: ticket._id,
      by: req.user._id,
      details: `Assigned to ${agent.name}`
    });

    // ✅ Send mock notifications
    const owner = await User.findById(ticket.owner);

    sendNotification({
      to: agent.email,
      subject: 'New Ticket Assigned',
      message: `Ticket "${ticket.title}" has been assigned to you by the Admin.`
    });

    if (owner) {
      sendNotification({
        to: owner.email,
        subject: 'Agent Assigned',
        message: `Your ticket "${ticket.title}" has been assigned to Agent ${agent.name}.`
      });
    }

    res.json({
      message: 'Agent assigned successfully',
      ticket: {
        id: ticket._id,
        title: ticket.title,
        assignedTo: agent.name,
        status: ticket.status,
      },
    });
  } catch (err) {
    console.error('Error assigning ticket:', err);
    res.status(500).json({ message: 'Server error while assigning ticket' });
  }
});

/**
 * @route   GET /api/admin/activities
 * @desc    Fetch recent activity logs (admin only)
 * @access  Admin
 */
router.get('/activities', auth, roles(['admin']), async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('by', 'name email')
      .populate('ticket', 'title')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ message: 'Server error while fetching activities' });
  }
});

module.exports = router;

