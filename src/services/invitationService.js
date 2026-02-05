const mongoose = require('mongoose');
const Job = require('../models/Job');
const Invitation = require('../models/Invitation');

async function create(jobId, employerId, talentId) {
  const job = await Job.findById(jobId).lean();
  if (!job) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }
  if (job.createdBy !== employerId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  const existing = await Invitation.findOne({ jobId, talentId });
  if (existing) {
    const err = new Error('Invitation already exists');
    err.status = 400;
    throw err;
  }
  const invitation = await Invitation.create({
    jobId: new mongoose.Types.ObjectId(jobId),
    employerId,
    talentId,
    status: 'pending',
  });
  return invitation;
}

async function listForTalent(talentId) {
  const invitations = await Invitation.find({ talentId })
    .populate('jobId')
    .sort({ createdAt: -1 })
    .lean();
  return invitations;
}

async function respond(invitationId, talentId, status) {
  if (!['accepted', 'declined'].includes(status)) {
    const err = new Error('Invalid status');
    err.status = 400;
    throw err;
  }
  const invitation = await Invitation.findById(invitationId).lean();
  if (!invitation) {
    const err = new Error('Invitation not found');
    err.status = 404;
    throw err;
  }
  if (invitation.talentId !== talentId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  if (invitation.status !== 'pending') {
    const err = new Error('Invitation already responded');
    err.status = 400;
    throw err;
  }
  const updated = await Invitation.findByIdAndUpdate(
    invitationId,
    { status },
    { new: true }
  )
    .populate('jobId')
    .lean();
  return updated;
}

module.exports = { create, listForTalent, respond };
