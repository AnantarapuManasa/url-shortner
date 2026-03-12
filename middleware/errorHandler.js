const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === '23505') { // PostgreSQL unique violation, MySQL similar
    return res.status(409).json({ error: 'Short code already exists. Try again.' });
  }

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: 'Database connection failed' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = { errorHandler };

