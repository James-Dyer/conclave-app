const mongoose = require('mongoose');
const Member = require('./models/Member');
const Charge = require('./models/Charge');
const data = require('../mockData.json');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Member.deleteMany({});
  await Charge.deleteMany({});

  await Member.insertMany(data.members);

  const charges = data.charges.map(c => ({
    memberName: data.members.find(m => m.id === c.memberId)?.name || '',
    description: c.description,
    tags: c.tags,
    status: c.status
  }));
  await Charge.insertMany(charges);

  console.log('Seeded database');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
