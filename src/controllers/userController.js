const userService = require('../services/userService');

async function onboard(req, res, next) {
  try {
    const { name, email, role } = req.body;
    const uid = req.user.uid;
    const user = await userService.onboard(uid, { name, email, role });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { onboard };
