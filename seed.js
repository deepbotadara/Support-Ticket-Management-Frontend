const bcrypt = require('bcryptjs');
const { User, Role, sequelize } = require('./src/models');

const users = [
  { name: 'Deep', email: 'deep@manager.com', password: 'password123', role: 'MANAGER' },
  { name: 'Arjunbala', email: 'arjunbala@manager.com', password: 'password123', role: 'MANAGER' },
  { name: 'Jayesh', email: 'jayesh@support.com', password: 'password123', role: 'SUPPORT' },
  { name: 'Preet', email: 'preet@user.com', password: 'password123', role: 'USER' },
];

async function seed() {
  await sequelize.sync();

  const roles = await Role.findAll();
  const roleMap = {};
  roles.forEach(r => roleMap[r.name] = r.id);

  for (const u of users) {
    const existing = await User.findOne({ where: { email: u.email } });
    if (existing) {
      console.log(`already exists: ${u.email}`);
      continue;
    }
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({ name: u.name, email: u.email, password: hash, role_id: roleMap[u.role] });
    console.log(`created: ${u.email} (${u.role})`);
  }

  console.log('done');
  await sequelize.close();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
