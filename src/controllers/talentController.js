const talentService = require('../services/talentService');

async function getMatchedTalents(req, res, next) {
  try {
    const jobId = req.query.jobId;
    if (!jobId) {
      return next(Object.assign(new Error('jobId query required'), { status: 400 }));
    }
    const result = await talentService.getMatchedTalents(jobId, req.user.uid);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getMatchedJobs(req, res, next) {
  try {
    const result = await talentService.getMatchedJobsForTalent(req.user.uid);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMatchedTalents, getMatchedJobs };
