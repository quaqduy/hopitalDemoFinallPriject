const mongoose = require('mongoose');

// Định nghĩa schema cho dịch vụ mổ
const surgeryServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware để cập nhật trường `updatedAt` trước khi lưu dữ liệu
surgeryServiceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Tạo model cho dịch vụ mổ
const SurgeryService = mongoose.model('SurgeryService', surgeryServiceSchema);

module.exports = SurgeryService;
