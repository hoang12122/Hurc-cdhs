const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const rawData = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(rawData);

const newEmail = 'admin.new@hurc.cdhs';
const newPassword = '123456';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(newPassword, salt);

const newUser = {
  id: `user-new-${Date.now()}`,
  name: "Admin Mới",
  email: newEmail,
  password: hash,
  role: "Admin (P.KTAT)",
  status: "active",
  department: "Management",
  isVerified: true,
  passwordLastChangedAt: new Date().toISOString()
};

if (!db.users) db.users = [];

// Remove existing if any
db.users = db.users.filter(u => u.email !== newEmail);
db.users.push(newUser);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Đã tạo User: ${newUser.name} | Email: ${newUser.email} | Pass: 123456`);
