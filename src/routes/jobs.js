const express = require('express');
const { auth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const {
  listJobs,
  getJob,
  createJob,
  generateJd,
  getApplicants,
} = require('../controllers/jobController');
const { apply } = require('../controllers/applicationController');

const router = express.Router();

router.get('/', listJobs);
router.get('/:id', getJob);

router.post('/', auth, requireRole(['EMPLOYER']), createJob);
router.post('/generate-jd', auth, requireRole(['EMPLOYER']), generateJd);
router.get('/:id/applicants', auth, requireRole(['EMPLOYER']), getApplicants);
router.post('/:id/apply', auth, requireRole(['TALENT']), apply);

module.exports = router;
