const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    logs: [
        {
            action: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Admin', adminSchema);
