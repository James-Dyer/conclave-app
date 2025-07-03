const express = require('express');
const router = express.Router();
const Charge = require('../models/Charge');

router.get('/', async (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  const filter = {};

  if (search) {
    filter.$or = [
      { memberName: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
    ];
  }

  const charges = await Charge.find(filter).lean();
  res.json(charges.map((c) => ({ ...c, id: c._id })));
});

module.exports = router;
