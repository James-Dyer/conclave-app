const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/', async (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  let query = supabase.from('profiles').select('*');

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;
