const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
