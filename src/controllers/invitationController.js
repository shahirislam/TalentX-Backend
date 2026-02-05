const invitationService = require('../services/invitationService');

async function create(req, res, next) {
  try {
    const { jobId, talentId } = req.body;
    if (!jobId || !talentId) {
      return next(Object.assign(new Error('jobId and talentId required'), { status: 400 }));
    }
    const invitation = await invitationService.create(
      jobId,
      req.user.uid,
      talentId
    );
    res.status(201).json(invitation);
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const invitations = await invitationService.listForTalent(req.user.uid);
    res.json(invitations);
  } catch (err) {
    next(err);
  }
}

async function respond(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) {
      return next(Object.assign(new Error('status required'), { status: 400 }));
    }
    const invitation = await invitationService.respond(
      req.params.id,
      req.user.uid,
      status
    );
    res.json(invitation);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, listMine, respond };
