const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low','medium','high'], default: 'low' },
  status: { type: String, enum: ['open','in_progress','resolved','withdrawn'], default: 'open' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  history: [{ message: String, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, date: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
