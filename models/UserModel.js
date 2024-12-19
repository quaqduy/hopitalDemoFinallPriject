const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Dùng để mã hóa mật khẩu

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false},
  password: { type: String, required: true },
  fullname: { type: String, required: false },
  address: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  role: { 
    type: String, 
    enum: ['patient', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'admin'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

// Mã hóa mật khẩu trước khi lưu
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu khi đăng nhập
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
