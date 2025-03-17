const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({
    success: false,
    error: err.message,
  });
};

module.exports = errorHandler;
