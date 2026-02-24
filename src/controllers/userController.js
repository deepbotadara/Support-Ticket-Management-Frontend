const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'name, email, password, and role are required.' });
  }

  const roleRecord = await Role.findOne({ where: { name: role } });
  if (!roleRecord) {
    return res.status(400).json({ message: `Invalid role. Must be MANAGER, SUPPORT, or USER.` });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role_id: roleRecord.id,
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email, role });
};

const getUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'created_at'],
    include: [{ model: Role, as: 'role', attributes: ['name'] }],
  });

  res.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role.name,
      created_at: u.created_at,
    }))
  );
};

module.exports = { createUser, getUsers };
