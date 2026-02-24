const sequelize       = require('../config/db');
const Role            = require('./Role');
const User            = require('./User');
const Ticket          = require('./Ticket');
const TicketComment   = require('./TicketComment');
const TicketStatusLog = require('./TicketStatusLog');

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

User.hasMany(Ticket, { foreignKey: 'created_by', as: 'createdTickets' });
Ticket.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Ticket, { foreignKey: 'assigned_to', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Ticket.hasMany(TicketComment, { foreignKey: 'ticket_id', as: 'comments', onDelete: 'CASCADE' });
TicketComment.belongsTo(Ticket, { foreignKey: 'ticket_id' });

User.hasMany(TicketComment, { foreignKey: 'user_id', as: 'comments' });
TicketComment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Ticket.hasMany(TicketStatusLog, { foreignKey: 'ticket_id', as: 'statusLogs', onDelete: 'CASCADE' });
TicketStatusLog.belongsTo(Ticket, { foreignKey: 'ticket_id' });

User.hasMany(TicketStatusLog, { foreignKey: 'changed_by', as: 'statusChanges' });
TicketStatusLog.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

module.exports = { sequelize, Role, User, Ticket, TicketComment, TicketStatusLog };
