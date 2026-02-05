const express = require('express');
const { auth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const { getMatchedJobs } = require('../controllers/talentController');

const router = express.Router();

router.get('/jobs/matched', auth, requireRole(['TALENT']), getMatchedJobs);

module.exports = router;
