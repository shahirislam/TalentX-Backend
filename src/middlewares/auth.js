const { getAuth } = require('../config/firebase');
const User = require('../models/User');

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const idToken = header.slice(7);
  try {
    const auth = getAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const userDoc = await User.findOne({ uid }).lean();
    req.user = userDoc
      ? { ...userDoc, uid }
      : { uid, name: decoded.name ?? '', email: decoded.email ?? '', role: null };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { auth };
