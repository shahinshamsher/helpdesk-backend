const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  action: String,
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: String
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
