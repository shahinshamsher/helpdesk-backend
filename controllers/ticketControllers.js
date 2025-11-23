const Ticket = require("../models/Ticket");

// Create ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = new Ticket({
      user: req.user.id,
      title,
      description,
      category,
      priority,
      status: "Open",
    });

    await ticket.save();

    res.status(201).json({ message: "Ticket created successfully", ticket });

  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tickets
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user", "name email");
    res.json(tickets);
  } catch (err) {
    console.error("Get tickets error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("user", "name email");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update ticket status / details
exports.updateTicket = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority },
      { new: true }
    );

    res.json(ticket);
  } catch (err) {
    console.error("Update ticket error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error("Delete ticket error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
