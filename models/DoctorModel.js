const mongoose = require('mongoose');

// Định nghĩa schema cho Bác sĩ (Doctor)
const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalService', required: true }, // Quan hệ với MedicalService
  createdAt: { type: Date, default: Date.now }
}, { 
  collection: 'Doctor' // Đặt tên collection là 'Doctor'
});

module.exports = mongoose.model('Doctor', DoctorSchema);
