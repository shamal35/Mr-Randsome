// Validate metrics data
exports.validateMetrics = (req, res, next) => {
  const { metrics } = req.body;

  if (!metrics) {
    return res.status(400).json({ message: 'Metrics data is required' });
  }

  const { cpuUsage, memoryUsage, networkTraffic, activeConnections } = metrics;

  if (typeof cpuUsage !== 'number' || cpuUsage < 0 || cpuUsage > 100) {
    return res.status(400).json({ message: 'Invalid CPU usage value' });
  }

  if (typeof memoryUsage !== 'number' || memoryUsage < 0 || memoryUsage > 100) {
    return res.status(400).json({ message: 'Invalid memory usage value' });
  }

  if (typeof networkTraffic !== 'number' || networkTraffic < 0) {
    return res.status(400).json({ message: 'Invalid network traffic value' });
  }

  if (typeof activeConnections !== 'number' || activeConnections < 0) {
    return res.status(400).json({ message: 'Invalid active connections value' });
  }

  next();
}; 