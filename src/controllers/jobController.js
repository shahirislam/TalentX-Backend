const jobService = require('../services/jobService');

async function listJobs(req, res, next) {
  try {
    const jobs = await jobService.listJobs();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

async function getJob(req, res, next) {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (err) {
    next(err);
  }
}

async function createJob(req, res, next) {
  try {
    const { title, companyName, techStack, description, deadline } = req.body;
    if (!title || !companyName || !deadline) {
      return next(Object.assign(new Error('Missing required fields'), { status: 400 }));
    }
    const job = await jobService.createJob({
      title,
      companyName,
      techStack: Array.isArray(techStack) ? techStack : [],
      description: description ?? '',
      deadline: new Date(deadline),
      createdBy: req.user.uid,
    });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

async function generateJd(req, res, next) {
  try {
    const { title, techStack } = req.body;
    if (!title) {
      return next(Object.assign(new Error('title is required'), { status: 400 }));
    }
    const result = await jobService.generateJd(title, techStack ?? []);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getApplicants(req, res, next) {
  try {
    const applicants = await jobService.getApplicants(req.params.id, req.user.uid);
    res.json(applicants);
  } catch (err) {
    next(err);
  }
}

module.exports = { listJobs, getJob, createJob, generateJd, getApplicants };
