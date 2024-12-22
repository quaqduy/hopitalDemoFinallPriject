const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bedCount: {
    type: Number,
    required: true,
    min: 0, // Không cho phép số giường âm
  },
  emptyBeds: {
    type: Number,
    required: true,
    min: 0, // Không cho phép số giường trống âm
    validate: {
      validator: function (value) {
        return value <= this.bedCount; // Số giường trống không được vượt quá tổng số giường
      },
      message: 'Empty beds cannot exceed total beds',
    },
  },
  bedPricePerDay: {
    type: Number,
    required: true,
    min: 0, // Giá giường không được âm
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse', // Liên kết với bảng (collection) Nurse
    required: true,
  },
  roomType: {
    type: String,
    enum: ['VIP', 'Basic'], // Chỉ nhận giá trị "VIP" hoặc "Basic"
    required: true,
  },
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

module.exports = mongoose.model('Room', RoomSchema);
