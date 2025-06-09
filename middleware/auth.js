exports.ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
  };
  
  exports.ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role==='admin') return next();
    res.redirect('/auth/login');
  };
  