const applicationService = require('../services/applicationService');

async function apply(req, res, next) {
  try {
    const jobId = req.params.id;
    const talentId = req.user.uid;
    const application = await applicationService.apply(jobId, talentId);
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}

module.exports = { apply };
