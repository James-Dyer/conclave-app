const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

router.get('/', async (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  const filter = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
    ];
  }

  const members = await Member.find(filter);
  res.json(members);
});

module.exports = router;
