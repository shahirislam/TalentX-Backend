const express = require('express');
const { auth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const { getMatchedTalents, getAllTalents } = require('../controllers/talentController');

const router = express.Router();

router.get('/matched', auth, requireRole(['EMPLOYER']), getMatchedTalents);
router.get('/all', auth, requireRole(['EMPLOYER']), getAllTalents);

module.exports = router;
