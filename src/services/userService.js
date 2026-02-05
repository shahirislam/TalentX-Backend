const User = require('../models/User');

async function onboard(uid, { name, email, role }) {
  if (!role || !['EMPLOYER', 'TALENT'].includes(role)) {
    const err = new Error('Invalid role');
    err.status = 400;
    throw err;
  }
  const user = await User.findOneAndUpdate(
    { uid },
    { name: name ?? '', email: email ?? '', role },
    { new: true, upsert: true }
  );
  return user;
}

module.exports = { onboard };
