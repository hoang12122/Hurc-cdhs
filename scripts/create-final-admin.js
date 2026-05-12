const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const rawData = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(rawData);

const newEmail = 'admin.final@hurc.cdhs';
const newPassword = 'Admin@2026';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(newPassword, salt);

const newUser = {
  id: `user-admin-final-${Date.now()}`,
  name: "Quản trị viên Hệ thống",
  email: newEmail,
  password: hash,
  role: "Admin (P.KTAT)",
  status: "active",
  department: "Management",
  isVerified: true,
  passwordLastChangedAt: new Date().toISOString()
};

if (!db.users) db.users = [];

// Remove existing with same email if any
db.users = db.users.filter(u => u.email !== newEmail);
db.users.push(newUser);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully created Admin: ${newUser.name} | Email: ${newUser.email} | Pass: ${newPassword}`);
