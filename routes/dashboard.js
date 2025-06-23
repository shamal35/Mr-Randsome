const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard');
const auth = require('../middleware/auth');
const { validateMetrics } = require('../middleware/validation');

// Get current dashboard state
router.get('/state', auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne().sort({ createdAt: -1 });
    if (!dashboard) {
      return res.status(404).json({ message: 'No dashboard data found' });
    }
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard state', error: error.message });
  }
});

// Update system metrics
router.post('/metrics', auth, validateMetrics, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne().sort({ createdAt: -1 });
    if (!dashboard) {
      const newDashboard = new Dashboard({
        systemMetrics: req.body.metrics
      });
      await newDashboard.save();
      return res.json(newDashboard);
    }

    dashboard.updateMetrics(req.body.metrics);
    await dashboard.save();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating metrics', error: error.message });
  }
});

// Add new alert
router.post('/alerts', auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne().sort({ createdAt: -1 });
    if (!dashboard) {
      return res.status(404).json({ message: 'No dashboard found' });
    }

    dashboard.addAlert(req.body.alert);
    await dashboard.save();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error adding alert', error: error.message });
  }
});

// Get recent alerts
router.get('/alerts', auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne()
      .select('alerts')
      .sort({ createdAt: -1 });
    
    if (!dashboard) {
      return res.status(404).json({ message: 'No alerts found' });
    }

    res.json(dashboard.alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
});

// Update network map
router.post('/network-map', auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne().sort({ createdAt: -1 });
    if (!dashboard) {
      return res.status(404).json({ message: 'No dashboard found' });
    }

    dashboard.networkMap = req.body.networkMap;
    await dashboard.save();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating network map', error: error.message });
  }
});

// Add vulnerability
router.post('/vulnerabilities', auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne().sort({ createdAt: -1 });
    if (!dashboard) {
      return res.status(404).json({ message: 'No dashboard found' });
    }

    dashboard.addVulnerability(req.body.vulnerability);
    await dashboard.save();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error adding vulnerability', error: error.message });
  }
});

module.exports = router; 