const express = require('express');
const usersRouter = require('./users');
const jobsRouter = require('./jobs');
const talentsRouter = require('./talents');
const talentRouter = require('./talent');
const invitationsRouter = require('./invitations');

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));
router.use('/users', usersRouter);
router.use('/jobs', jobsRouter);
router.use('/talents', talentsRouter);
router.use('/talent', talentRouter);
router.use('/invitations', invitationsRouter);

module.exports = router;
