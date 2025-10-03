module.exports = (req, res, next) => {
  req.audit = {
    timestamp: new Date().toISOString(),
    user: 'demoUser',
    consentVersion: req.headers['x-consent-version'] || '2025.1'
  };
  next();
};