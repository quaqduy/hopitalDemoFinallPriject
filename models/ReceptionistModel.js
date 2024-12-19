const mongoose = require('mongoose');

const ReceptionistSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  shift: { 
    type: String, 
    enum: ['morning', 'afternoon', 'night'], 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Receptionist', ReceptionistSchema);
