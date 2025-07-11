const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/', async (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  let query = supabase.from('charges').select('*');

  if (search) {
    query = query.or(
      `description.ilike.%${search}%,tags.cs.{${search}}`
    );
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;
