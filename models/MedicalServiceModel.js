// medicalService.model.js
const mongoose = require('mongoose');

const MedicalServiceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
},{ 
  collection: 'MedicalService'  // Đặt tên collection là ''
});

module.exports = mongoose.model('MedicalService', MedicalServiceSchema);
