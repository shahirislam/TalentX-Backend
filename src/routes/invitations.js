const express = require('express');
const { auth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const {
  create: createInvitation,
  listMine,
  respond,
} = require('../controllers/invitationController');

const router = express.Router();

router.post('/', auth, requireRole(['EMPLOYER']), createInvitation);
router.get('/', auth, requireRole(['TALENT']), listMine);
router.post('/:id/respond', auth, requireRole(['TALENT']), respond);

module.exports = router;
