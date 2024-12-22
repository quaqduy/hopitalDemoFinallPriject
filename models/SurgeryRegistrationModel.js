const mongoose = require('mongoose');

// Định nghĩa schema cho đăng ký mổ
const surgeryRegistrationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  surgeryService: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SurgeryService', // Liên kết với model dịch vụ mổ
    required: true 
  },
  surgeryDate: {
    type: Date,
    required: true,
  },
  surgeons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Liên kết với model Doctor (bác sĩ)
  }],
  status: { type: String, enum: ['Pending','Scheduled', 'Completed', 'Cancelled'], default: 'Pending' },
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
surgeryRegistrationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Tạo model cho đăng ký mổ
const SurgeryRegistration = mongoose.model('SurgeryRegistration', surgeryRegistrationSchema);

module.exports = SurgeryRegistration;
