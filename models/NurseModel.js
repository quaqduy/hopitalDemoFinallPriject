const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    workSchedule: [
        {
            date: { type: Date, required: true },
            shift: { type: String, enum: ['Morning', 'Afternoon', 'Night'], required: true },
            status: { type: String, enum: ['On Duty', 'Off Duty'], default: 'On Duty' }
        }
    ]
});

module.exports = mongoose.model('Nurse', nurseSchema);
