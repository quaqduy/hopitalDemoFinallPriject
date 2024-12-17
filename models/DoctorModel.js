const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    schedule: [
        {
            date: { type: Date, required: true },
            timeSlot: { type: String, required: true }, // e.g., '08:00 - 12:00'
            status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' }
        }
    ],
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
});

module.exports = mongoose.model('Doctor', doctorSchema);
