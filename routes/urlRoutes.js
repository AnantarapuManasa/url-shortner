const express = require('express');
const router = express.Router();

const { shorten, redirect } = require('../controllers/urlController');

router.post('/shorten', shorten);
router.get('/:shortCode', redirect);

module.exports = router;