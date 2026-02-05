const Job = require('../models/Job');
const User = require('../models/User');
const { scoreTalentsForJob, scoreJobsForTalent } = require('./geminiService');

const TALENT_LIMIT = 50;

async function getMatchedTalents(jobId, employerUid) {
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
  const talents = await User.find({ role: 'TALENT' }).limit(TALENT_LIMIT).lean();
  if (talents.length === 0) return [];
  const scored = await scoreTalentsForJob(job, talents);
  const byUid = Object.fromEntries(talents.map((t) => [t.uid, t]));
  const merged = scored
    .map((s) => ({
      talent: byUid[s.talentId] ?? { uid: s.talentId, name: '', email: '', skills: [] },
      score: s.score ?? 0,
      reason: s.reason ?? '',
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return merged;
}

async function getMatchedJobsForTalent(talentUid) {
  const talent = await User.findOne({ uid: talentUid }).lean();
  if (!talent) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const now = new Date();
  const jobs = await Job.find({ deadline: { $gte: now } }).lean();
  if (jobs.length === 0) return [];
  const scored = await scoreJobsForTalent(talent, jobs);
  const jobMap = Object.fromEntries(jobs.map((j) => [String(j._id), j]));
  const merged = scored
    .filter((s) => jobMap[s.jobId])
    .map((s) => ({
      job: jobMap[s.jobId],
      score: s.score ?? 0,
      reason: s.reason ?? '',
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return merged;
}

module.exports = { getMatchedTalents, getMatchedJobsForTalent };
