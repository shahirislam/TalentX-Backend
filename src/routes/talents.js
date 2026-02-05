const express = require('express');
const { auth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const { getMatchedTalents } = require('../controllers/talentController');

const router = express.Router();

router.get('/matched', auth, requireRole(['EMPLOYER']), getMatchedTalents);

module.exports = router;
