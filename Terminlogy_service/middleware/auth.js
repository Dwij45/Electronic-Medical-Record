module.exports = (req, res, next) => {
  // Demo: Always allow. Add ABHA/NDHM validation for production.
  next();
};