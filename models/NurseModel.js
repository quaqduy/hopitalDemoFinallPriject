const mongoose = require('mongoose');

const NurseSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  shift: { 
    type: String, 
    enum: ['morning', 'afternoon', 'night'], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Nurse', NurseSchema);
