const mongoose = require('mongoose');

const RoomRegisterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to User schema
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', // Link to Room schema
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Cancelled'], // Valid values for the status field
    default: 'Pending', // Default value is 'Prescribed'
  }
}, { timestamps: true }); // Automatically add createdAt and updatedAt

module.exports = mongoose.model('RoomRegister', RoomRegisterSchema);
