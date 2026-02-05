const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    talentId: { type: String, required: true },
    source: { type: String, enum: ['manual', 'invitation'], required: true },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, talentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
