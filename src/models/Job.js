const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    techStack: { type: [String], default: [] },
    description: { type: String, default: '' },
    deadline: { type: Date, required: true },
    createdBy: { type: String, required: true },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ createdBy: 1 });
jobSchema.index({ deadline: 1 });

module.exports = mongoose.model('Job', jobSchema);
