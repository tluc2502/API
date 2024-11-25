const mongoose = require('mongoose');
const schema = mongoose.Schema;

const sinhVienSchema = new schema({
  mssv: {
    type: String,
    required: true,
    unique: true,
  },
  hoTen: {
    type: String,
    required: true,
  },
  diemTrungBinh: {
    type: Number,
    required: true,
  },
  boMon: {
    type: String,
    required: true,
  },
  tuoi: {
    type: Number,
    required: true,
  },
});

const SinhVien = mongoose.model('SinhVien', sinhVienSchema);

module.exports = SinhVien;
