const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const rawData = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(rawData);

const newPassword = '123456';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(newPassword, salt);

let updated = false;
if (db.users) {
  const admin = db.users.find(u => u.email === 'superadmin@hurc.cdhs');
  if (admin) {
    admin.password = hash;
    updated = true;
    console.log(`Đã cập nhật password cho: ${admin.name} (${admin.email})`);
  } else {
    console.log('Không tìm thấy user superadmin@hurc.cdhs');
  }
}

if (updated) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Đã lưu thay đổi vào db.json');
}
