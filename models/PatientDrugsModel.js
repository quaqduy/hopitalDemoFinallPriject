const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho PatientDrugsModel
const PatientDrugsSchema = new Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId, // Đây là kiểu ObjectId cho cuộc hẹn
    ref: 'Appointment', // Liên kết với mô hình Appointment
    required: true, // Đảm bảo rằng trường này là bắt buộc
  },
  drugs: [{
    type: mongoose.Schema.Types.ObjectId, // Kiểu ObjectId cho thuốc
    ref: 'Drug', // Liên kết với mô hình Drug
    required: true, // Đảm bảo rằng mảng thuốc này không thể trống
  }],
  status: {
    type: String,
    enum: ['Prescribed', 'Dispensed'], // Valid values for the status field
    default: 'Prescribed', // Default value is 'Prescribed'
  }
}, { timestamps: true }); // Tạo các trường thời gian (createdAt, updatedAt)

// Tạo mô hình từ schema trên
const PatientDrugsModel = mongoose.model('PatientDrugs', PatientDrugsSchema);

module.exports = PatientDrugsModel;
