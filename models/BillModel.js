const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: false },
  patientDrugsId: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientDrugs', required: false },
  surgeryRegistrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurgeryRegistration', required: false },
  roomId:{type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false},
  status: { type: String, enum: ['Unpaid','Paid'], default: 'Unpaid' },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bill', BillSchema);
