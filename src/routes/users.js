const express = require('express');
const { auth } = require('../middlewares/auth');
const { onboard } = require('../controllers/userController');

const router = express.Router();

router.post('/onboard', auth, onboard);

module.exports = router;
