const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho Sản phẩm
const SanphamSchema = new Schema({
  masp: { type: String, required: true, unique: true },  // Mã sản phẩm (mã duy nhất)
  tensp: { type: String, required: true },              // Tên sản phẩm
  gia: { type: Number, required: true },                // Giá sản phẩm
  soluong: { type: Number, required: true },            // Số lượng sản phẩm
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }  // Danh mục (tham chiếu tới model Category)
});

// Tạo model cho Sản phẩm
const Sanpham = mongoose.model('Sanpham', SanphamSchema);

module.exports = Sanpham;
