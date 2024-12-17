const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
    medications: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            expiryDate: { type: Date, required: true }
        }
    ],
    prescriptions: [
        {
            prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
            doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
            medications: [String],
            date: { type: Date, required: true }
        }
    ]
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);
