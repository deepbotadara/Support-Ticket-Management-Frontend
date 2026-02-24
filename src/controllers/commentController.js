const { Ticket, TicketComment, User } = require('../models');

const canAccessTicket = (req, ticket) => {
  const { id, role } = req.user;
  if (role === 'MANAGER') return true;
  if (role === 'SUPPORT' && ticket.assigned_to === id) return true;
  if (role === 'USER'    && ticket.created_by  === id) return true;
  return false;
};

const addComment = async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  if (!canAccessTicket(req, ticket)) {
    return res.status(403).json({ message: 'Forbidden. You do not have access to this ticket.' });
  }

  const { comment } = req.body;
  if (!comment) return res.status(400).json({ message: 'comment is required.' });

  const newComment = await TicketComment.create({
    ticket_id: ticket.id,
    user_id: req.user.id,
    comment,
  });

  res.status(201).json(newComment);
};

const getComments = async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  if (!canAccessTicket(req, ticket)) {
    return res.status(403).json({ message: 'Forbidden. You do not have access to this ticket.' });
  }

  const comments = await TicketComment.findAll({
    where: { ticket_id: ticket.id },
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
    order: [['created_at', 'ASC']],
  });

  res.json(comments);
};

const updateComment = async (req, res) => {
  const commentRecord = await TicketComment.findByPk(req.params.id);
  if (!commentRecord) return res.status(404).json({ message: 'Comment not found.' });

  const { role, id } = req.user;
  if (role !== 'MANAGER' && commentRecord.user_id !== id) {
    return res.status(403).json({ message: 'Forbidden. Only the author or a MANAGER can edit this comment.' });
  }

  const { comment } = req.body;
  if (!comment) return res.status(400).json({ message: 'comment is required.' });

  await commentRecord.update({ comment });
  res.json(commentRecord);
};

const deleteComment = async (req, res) => {
  const commentRecord = await TicketComment.findByPk(req.params.id);
  if (!commentRecord) return res.status(404).json({ message: 'Comment not found.' });

  const { role, id } = req.user;
  if (role !== 'MANAGER' && commentRecord.user_id !== id) {
    return res.status(403).json({ message: 'Forbidden. Only the author or a MANAGER can delete this comment.' });
  }

  await commentRecord.destroy();
  res.status(204).send();
};

module.exports = { addComment, getComments, updateComment, deleteComment };
