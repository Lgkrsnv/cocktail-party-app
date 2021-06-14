const router = require('express').Router();
const User = require('../models/User')

router.get('/', async (req, res) => {
  res.redirect('/parties');
});

module.exports = router;
