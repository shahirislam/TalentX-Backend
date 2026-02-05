function requireRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden', code: 'ROLE_MISMATCH' });
    }
    next();
  };
}

module.exports = { requireRole };
