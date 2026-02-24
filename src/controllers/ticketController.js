const { Ticket, User, Role, TicketComment, TicketStatusLog } = require('../models');

const STATUS_ORDER = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const isValidTransition = (from, to) => {
  const fromIdx = STATUS_ORDER.indexOf(from);
  const toIdx = STATUS_ORDER.indexOf(to);
  return toIdx === fromIdx + 1;
};

const createTicket = async (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || title.length < 5) {
    return res.status(400).json({ message: 'Title must be at least 5 characters.' });
  }
  if (!description || description.length < 10) {
    return res.status(400).json({ message: 'Description must be at least 10 characters.' });
  }

  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Priority must be LOW, MEDIUM, or HIGH.' });
  }

  const ticket = await Ticket.create({
    title,
    description,
    priority: priority || 'MEDIUM',
    created_by: req.user.id,
  });

  res.status(201).json(ticket);
};

const getTickets = async (req, res) => {
  const { role, id } = req.user;
  let where = {};

  if (role === 'SUPPORT') where.assigned_to = id;
  else if (role === 'USER') where.created_by = id;

  const { status, priority, page, limit } = req.query;

  if (status) {
    if (!STATUS_ORDER.includes(status)) {
      return res.status(400).json({ message: 'Invalid status filter. Must be OPEN, IN_PROGRESS, RESOLVED, or CLOSED.' });
    }
    where.status = status;
  }

  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
  if (priority) {
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority filter. Must be LOW, MEDIUM, or HIGH.' });
    }
    where.priority = priority;
  }

  const pageNum  = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const offset   = (pageNum - 1) * pageSize;

  const { count, rows: tickets } = await Ticket.findAndCountAll({
    where,
    include: [
      { model: User, as: 'creator',  attributes: ['id', 'name', 'email'] },
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
    ],
    order: [['created_at', 'DESC']],
    limit: pageSize,
    offset,
  });

  res.json({
    tickets,
    pagination: {
      total: count,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  });
};

const assignTicket = async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'userId is required.' });
  }

  const assignee = await User.findByPk(userId, {
    include: [{ model: Role, as: 'role' }],
  });
  if (!assignee) return res.status(404).json({ message: 'Assignee user not found.' });
  if (assignee.role.name === 'USER') {
    return res.status(400).json({ message: 'Tickets cannot be assigned to users with role USER.' });
  }

  await ticket.update({ assigned_to: userId });
  res.json({ message: 'Ticket assigned successfully.', ticket });
};

const updateTicketStatus = async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  const { status } = req.body;
  if (!status || !STATUS_ORDER.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  if (!isValidTransition(ticket.status, status)) {
    return res.status(400).json({
      message: `Invalid status transition: ${ticket.status} → ${status}. Allowed order: OPEN → IN_PROGRESS → RESOLVED → CLOSED.`,
    });
  }

  const oldStatus = ticket.status;
  await ticket.update({ status });

  await TicketStatusLog.create({
    ticket_id:  ticket.id,
    old_status: oldStatus,
    new_status: status,
    changed_by: req.user.id,
  });

  res.json({ message: 'Status updated.', ticket });
};

const deleteTicket = async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  await ticket.destroy();
  res.status(204).send();
};

module.exports = { createTicket, getTickets, assignTicket, updateTicketStatus, deleteTicket };
