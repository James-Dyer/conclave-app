const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function loadCsv(file) {
  const csv = fs.readFileSync(path.join(__dirname, '..', 'mock-data', file), 'utf8');
  return parse(csv, { columns: true, skip_empty_lines: true });
}

const profileRows = loadCsv('profiles.csv');
const members = profileRows.map((row) => {
  return {
    id: row.id,
    email: row.email,
    password: row.email === 'admin@example.com' ? 'admin' : 'password',
    name: row.name,
    isAdmin: row.is_admin === 'true' || row.is_admin === true,
    status: row.status,
    initiationDate: row.initiation_date,
    amountOwed: Number(row.amount_owed),
    tags: row.tags ? row.tags.replace(/[{}]/g, '').split(',').map(t => t.trim()).filter(Boolean) : []
  };
});

const charges = loadCsv('charges.csv').map((row) => ({
  id: Number(row.id),
  memberId: row.member_id,
  status: row.status,
  amount: Number(row.amount),
  dueDate: row.due_date,
  description: row.description,
  tags: row.tags ? row.tags.replace(/[{}]/g, '').split(',').map(t => t.trim()).filter(Boolean) : []
}));

module.exports = { members, charges };
