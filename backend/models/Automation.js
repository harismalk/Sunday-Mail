const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  label: { 
    type: String, 
    required: true,
    trim: true,
    unique: false // Handled manually in pre-save validation
  },
  description: { 
    type: String, 
    default: '' 
  },
  conditions: {
    subjectContains: [String], // Array of keywords for subject matching
    bodyContains: [String],    // Array of keywords for body matching
  },
  actions: {
    markImportant: { type: Boolean, default: false },
    autoDraft: { type: Boolean, default: false },
    autoDraftInstructions: { type: String, default: '' },
    autoReply: { type: Boolean, default: false },
    autoReplyInstructions: { type: String, default: '' },
    autoForward: { type: Boolean, default: false },
    forwardTo: { type: String, default: '' },
    textNotification: { type: Boolean, default: false },
    phoneNumber: { type: String, default: '' },
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  methods: {
    // Method to validate automation fields
    validate_action() {
      if (!this.label) {
        throw new Error('Label is required');
      }
      if (!this.conditions.subjectContains.length && !this.conditions.bodyContains.length) {
        throw new Error('At least one condition (subjectContains or bodyContains) is required');
      }
      if (this.actions.autoForward && !this.actions.forwardTo) {
        throw new Error('ForwardTo address is required if autoForward is enabled');
      }
      if (this.actions.textNotification && !this.actions.phoneNumber) {
        throw new Error('PhoneNumber is required if textNotification is enabled');
      }
    }
  }
});

// Pre-save middleware to ensure unique labels per user
automationSchema.pre('save', async function(next) {
  try {
    const existingAutomation = await this.constructor.findOne({
      userId: this.userId,
      label: this.label,
      _id: { $ne: this._id } // Exclude the current automation
    });

    if (existingAutomation) {
      throw new Error('An automation with this label already exists');
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-update middleware to validate the updated fields
automationSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();

    if (update.actions?.autoForward && !update.actions.forwardTo) {
      throw new Error('ForwardTo address is required if autoForward is enabled');
    }

    if (update.actions?.textNotification && !update.actions.phoneNumber) {
      throw new Error('PhoneNumber is required if textNotification is enabled');
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Automation', automationSchema);
