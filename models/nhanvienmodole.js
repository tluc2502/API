const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho Nhân viên
const NhanVienSchema = new Schema({
  name: { type: String, required: true },             // Tên nhân viên
  position: { type: String, required: true },         // Chức vụ
  gender: { type: String, required: true },           // Giới tính
  dob: { type: Date, required: true },                // Ngày sinh
  email: { type: String, required: true, unique: true }, // Email
  address: { type: String, required: true },          // Địa chỉ
  department: { type: String, required: true },       // Bộ phận
});

// Tạo model cho Nhân viên
const NhanVien = mongoose.model('nhanVien', NhanVienSchema);

module.exports = NhanVien;