const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  response: {
    message: String,
    repliedAt: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

// Method to mark as read
contactSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

// Method to archive
contactSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Method to add response
contactSchema.methods.addResponse = function(responseMessage) {
  this.response = {
    message: responseMessage,
    repliedAt: new Date()
  };
  this.status = 'replied';
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema); 