const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  serviceType: { 
    type: String, 
    enum: ['Check-up', 'Test'], // Chọn giữa 'Check-up' (Khám bệnh) và 'Test' (Xét nghiệm)
    required: true 
  },
  resultDetails: { 
    type: String, 
    required: true, 
    // Có thể là kết quả khám hoặc xét nghiệm tùy theo serviceType
  },
  testType: { 
    type: String, 
    required: function() {
      // Nếu là xét nghiệm, trường này là bắt buộc
      return this.serviceType === 'Test'; 
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
