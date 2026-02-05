const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Invitation = require('../models/Invitation');

async function apply(jobId, talentId) {
  const job = await Job.findById(jobId).lean();
  if (!job) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }
  if (new Date(job.deadline) < new Date()) {
    const err = new Error('Deadline passed');
    err.status = 400;
    throw err;
  }
  const existing = await Application.findOne({ jobId, talentId });
  if (existing) {
    const err = new Error('Already applied');
    err.status = 400;
    throw err;
  }
  const invitation = await Invitation.findOne({
    jobId,
    talentId,
    status: 'accepted',
  }).lean();
  const source = invitation ? 'invitation' : 'manual';

  await Job.findOneAndUpdate(
    { _id: jobId },
    { $inc: { applicationsCount: 1 } }
  );
  const application = await Application.create({
    jobId: new mongoose.Types.ObjectId(jobId),
    talentId,
    source,
  });
  return application;
}

async function listByTalent(talentId) {
  const applications = await Application.find({ talentId })
    .populate('jobId', 'title companyName deadline')
    .lean()
    .sort({ createdAt: -1 });
  return applications.map((a) => {
    const pop = a.jobId;
    return {
      _id: a._id,
      id: a._id,
      jobId: pop?._id ?? a.jobId,
      talentId: a.talentId,
      source: a.source,
      job: pop
        ? {
            _id: pop._id,
            id: pop._id,
            title: pop.title,
            company: pop.companyName,
            companyName: pop.companyName,
            deadline: pop.deadline,
          }
        : null,
    };
  });
}

module.exports = { apply, listByTalent };
