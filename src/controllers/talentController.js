const talentService = require('../services/talentService');
const applicationService = require('../services/applicationService');

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

async function getMyApplications(req, res, next) {
  try {
    const applications = await applicationService.listByTalent(req.user.uid);
    res.json(applications);
  } catch (err) {
    next(err);
  }
}

async function getAllTalents(req, res, next) {
  try {
    const result = await talentService.listAllTalents();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMatchedTalents, getMatchedJobs, getMyApplications, getAllTalents };
