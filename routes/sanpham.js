const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const config = require('../util/tokenConfig');
const Sanpham = require('../models/sanphamModels');
// Route: Lấy tất cả sản phẩm
router.get('/tatcasp', async (req, res) => {
    try {
      const sanphams = await Sanpham.find();
      res.json(sanphams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Route: Thêm sản phẩm mới
  router.post('/themsp', async (req, res) => {
    const { masp, tensp, gia, soluong, category } = req.body;
  
    // Kiểm tra nếu các trường bắt buộc chưa có giá trị
    if (!masp || !tensp || !gia || !soluong || !category) {
      return res.status(400).send('Thiếu thông tin yêu cầu');
    }
  
    const newProduct = new Sanpham({
      masp,
      tensp,
      gia,
      soluong,
      category
    });
  
    try {
      const savedProduct = await newProduct.save();  // Lưu sản phẩm vào cơ sở dữ liệu
      res.status(201).json(savedProduct);  // Trả về sản phẩm đã lưu
    } catch (err) {
      res.status(500).send('Lỗi khi thêm sản phẩm: ' + err);
    }
  });
  // Route: Xoá sản phẩm theo masp
router.delete('/:masp', async (req, res) => {
    const { masp } = req.params;
  
    try {
      const deletedProduct = await Sanpham.findOneAndDelete({ masp });
  
      if (!deletedProduct) {
        return res.status(404).send('Không tìm thấy sản phẩm');
      }
  
      res.status(200).json({ message: 'Sản phẩm đã được xóa', product: deletedProduct });
    } catch (err) {
      res.status(500).send('Lỗi khi xoá sản phẩm: ' + err);
    }
  });
  
  // Route: Sửa thông tin sản phẩm
  router.put('/:masp', async (req, res) => {
    const { masp } = req.params;
    const { tensp, gia, soluong, category } = req.body;
  
    try {
      const updatedProduct = await Sanpham.findOneAndUpdate(
        { masp },  // Tìm sản phẩm theo masp
        { tensp, gia, soluong, category },  // Cập nhật các trường
        { new: true }  // Trả về bản ghi đã cập nhật
      );
  
      if (!updatedProduct) {
        return res.status(404).send('Không tìm thấy sản phẩm để sửa');
      }
  
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).send('Lỗi khi sửa sản phẩm: ' + err);
    }
  });
  
  // Route: Tìm sản phẩm theo tên
  router.get('/:masp', async (req, res) => {
    const { masp } = req.params;  // Lấy giá trị từ query parameter
  
    if (!masp) {
      return res.status(400).send('Thiếu thông tin tên sản phẩm');
    }
  
    try {
      const products = await Sanpham.find({ masp: { $regex: masp, $options: 'i' } })  // Tìm kiếm theo tên sản phẩm (Không phân biệt chữ hoa/thường)
        .populate('category', 'name');  // Populate tên danh mục
  
      if (products.length === 0) {
        return res.status(404).send('Không tìm thấy sản phẩm');
      }
  
      res.status(200).json(products);  // Trả về danh sách sản phẩm tìm được
    } catch (err) {
      res.status(500).send('Lỗi khi tìm kiếm sản phẩm: ' + err);
    }
  });

module.exports = router;