const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const { generateJobDescription } = require('./geminiService');

async function listJobs() {
  return Job.find().sort({ createdAt: -1 }).lean();
}

async function getJobById(id) {
  const job = await Job.findById(id).lean();
  if (!job) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }
  return job;
}

async function createJob(data) {
  const job = await Job.create(data);
  return job;
}

async function generateJd(title, techStack) {
  const description = await generateJobDescription(title, techStack);
  return { description };
}

async function getApplicants(jobId, employerUid) {
  const job = await Job.findById(jobId).lean();
  if (!job) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }
  if (job.createdBy !== employerUid) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  const applications = await Application.find({ jobId }).lean();
  const talentIds = [...new Set(applications.map((a) => a.talentId))];
  const users = await User.find({ uid: { $in: talentIds } }).lean();
  const userMap = Object.fromEntries(users.map((u) => [u.uid, u]));
  const applicants = applications.map((a) => ({
    ...a,
    talent: userMap[a.talentId] ?? { uid: a.talentId, name: '', email: '' },
  }));
  return applicants;
}

module.exports = { listJobs, getJobById, createJob, generateJd, getApplicants };
