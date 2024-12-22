const mongoose = require('mongoose');

// Create the schema for patient condition tracking
const patientConditionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming 'User' model represents the patient
    required: true
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse',  // Assuming 'Nurse' model exists
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',  // Assuming 'Room' model exists
    required: true
  },
  timeUpdate: {
    type: Date,
    default: Date.now  // Auto generate current timestamp
  },
  status: {
    type: String,
    enum: ['Under Treatment', 'Discharged'], // Valid values for the status field
    default: 'Under Treatment', // Default value is 'Prescribed'
  },
  description: {
    type: String,
    required: false  // Required field for tracking patient status
  }
});

// Create a model from the schema
const PatientCondition = mongoose.model('PatientCondition', patientConditionSchema);

module.exports = PatientCondition;
