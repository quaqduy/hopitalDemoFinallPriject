const mongoose = require('mongoose');

const DrugSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  usage: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  instructions: {
    type: String,
    required: true,
    trim: true,
  },  
  price: { // Giá thuốc
    type: Number,
    required: true,
    min: 0,
  },
  medicalService: { // Thêm mối quan hệ với MedicalService
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalService', // Tên model tham chiếu
    required: true, // Bắt buộc phải có dịch vụ liên quan
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Drug', DrugSchema);
