const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    role: { type: String, enum: ['EMPLOYER', 'TALENT'], required: true },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
