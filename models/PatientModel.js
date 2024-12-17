const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, unique: true },
    medicalHistory: [
        {
            date: { type: Date, required: true },
            diagnosis: { type: String, required: true },
            prescription: [String],
            doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
        }
    ],
    appointments: [
        {
            appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
        }
    ]
});

module.exports = mongoose.model('Patient', patientSchema);
