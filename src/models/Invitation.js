const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    employerId: { type: String, required: true },
    talentId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

invitationSchema.index({ jobId: 1, talentId: 1 });
invitationSchema.index({ talentId: 1 });

module.exports = mongoose.model('Invitation', invitationSchema);
