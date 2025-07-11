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

  const mapped = (data || []).map((row) => ({
    id: row.id,
    memberId: row.member_id,
    status: row.status,
    amount: row.amount,
    dueDate: row.due_date,
    description: row.description,
    tags: row.tags,
  }));

  res.json(mapped);
});

module.exports = router;
