const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  systemMetrics: {
    cpuUsage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    memoryUsage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    networkTraffic: {
      type: Number,
      required: true,
      min: 0
    },
    activeConnections: {
      type: Number,
      required: true,
      min: 0
    }
  },
  securityMetrics: {
    threatLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      required: true
    },
    vulnerabilities: [{
      type: {
        type: String,
        required: true
      },
      severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        required: true
      },
      description: String,
      detectedAt: {
        type: Date,
        default: Date.now
      }
    }],
    blockedAttempts: {
      type: Number,
      default: 0
    }
  },
  alerts: [{
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'ALERT', 'CRITICAL'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    source: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  networkMap: {
    nodes: [{
      id: String,
      type: String,
      status: String,
      lastSeen: Date
    }],
    connections: [{
      from: String,
      to: String,
      type: String,
      status: String
    }]
  }
}, {
  timestamps: true
});

// Index for efficient querying
dashboardSchema.index({ 'alerts.timestamp': -1 });
dashboardSchema.index({ 'securityMetrics.threatLevel': 1 });

// Method to add new alert
dashboardSchema.methods.addAlert = function(alert) {
  this.alerts.unshift(alert);
  if (this.alerts.length > 100) {
    this.alerts.pop();
  }
};

// Method to update system metrics
dashboardSchema.methods.updateMetrics = function(metrics) {
  this.systemMetrics = {
    ...this.systemMetrics,
    ...metrics
  };
};

// Method to add vulnerability
dashboardSchema.methods.addVulnerability = function(vulnerability) {
  this.securityMetrics.vulnerabilities.push(vulnerability);
};

module.exports = mongoose.model('Dashboard', dashboardSchema); 