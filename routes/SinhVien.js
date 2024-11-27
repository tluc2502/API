const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const config = require('../util/tokenConfig');
const SinhVien = require('../models/sinhvienModels');

// API 1: Lấy toàn bộ danh sách sinh viên
router.get('/all', async (req, res) => {
  try {
    
  const token = req.header("Authorization").split(' ')[1];
  if(token){
    JWT.verify(token, config.SECRETKEY, async function (err, id){
      if(err){
        res.status(403).json({"status": 403, "err": err});
      }else{
        const sinhViens = await SinhVien.find();
  
        res.json({ status: true, message: 'Thành công',  data: sinhViens});
      }
    });
  }else{
    res.status(401).json({"status": 401});
  }} catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API 2: Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
router.get('/cntt', async (req, res) => {
  try {
    const sinhViens = await SinhVien.find({ boMon: 'CNTT' });
    res.json(sinhViens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API 3: Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
router.get('/:minDtb-:maxDtb', async (req, res) => {
  const { minDtb, maxDtb } = req.params;

  try {
    const sinhViens = await SinhVien.find({
      diemTrungBinh: { $gte: parseFloat(minDtb), $lte: parseFloat(maxDtb) },
    });
    res.json(sinhViens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// API 4: Tìm kiếm thông tin của sinh viên theo MSSV
router.get('/getall/:mssv', async (req, res) => {

  try {
    const sinhVien = await SinhVien.findOne({ mssv: req.params.mssv });
    if (sinhVien) {
      res.json(sinhVien);
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API 5: Thêm mới một sinh viên
router.post('/update', async (req, res) => {
  const { mssv, hoTen, diemTrungBinh, boMon, tuoi } = req.body;
  const sinhVien = new SinhVien({
    mssv,
    hoTen,
    diemTrungBinh : parseFloat(diemTrungBinh),
    boMon,
    tuoi,
  });

  try {
    const newSinhVien = await sinhVien.save();
    res.status(201).json(newSinhVien);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API 6: Thay đổi thông tin sinh viên theo MSSV
router.put('/thaydoitt/:mssv', async (req, res) => {
  try {
    const sinhVien = await SinhVien.findOneAndUpdate(
      { mssv: req.params.mssv },
      req.body,
      { new: true }
    );
    if (sinhVien) {
      res.json(sinhVien);
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API 7: Xóa một sinh viên ra khỏi danh sách
router.delete('/:mssv', async (req, res) => {
  try {
    const sinhVien = await SinhVien.findOneAndDelete({ mssv: req.params.mssv });
    if (sinhVien) {
      res.json({ message: 'Sinh viên đã được xóa' });
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API 8: Lấy danh sách sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get('/:boMon/:minDtb', async (req, res) => {
  const { boMon, minDtb } = req.params;

  try {
    const sinhViens = await SinhVien.find({
      boMon: boMon,
      diemTrungBinh: { $gte: parseFloat(minDtb) },
    });
    res.json(sinhViens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); 

// API 9: Lấy danh sách sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT và có điểm trung bình từ 6.5
router.get('/:boMon/:minTuoi-:maxTuoi/:minDtb', async (req, res) => {
  const { boMon, minTuoi, maxTuoi, minDtb } = req.params;

  // Chuyển đổi các tham số và kiểm tra nếu không hợp lệ
  const minAge = parseInt(minTuoi);
  const maxAge = parseInt(maxTuoi);
  const minAverage = parseFloat(minDtb);

  if (isNaN(minAge) || isNaN(maxAge) || isNaN(minAverage)) {
    return res.status(400).json({ message: "Invalid input parameters" });
  }

  try {
    const sinhViens = await SinhVien.find({
      boMon: boMon,
      tuoi: { $gte: minAge, $lte: maxAge },
      diemTrungBinh: { $gte: minAverage },
    });
    res.json(sinhViens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// API 10: Sắp xếp danh sách sinh viên tăng dần theo điểm trung bình
router.get('/sapxepdiem', async (req, res) => {
  try {
    const sinhViens = await SinhVien.find().sort({ diemTrungBinh: 1 });
    res.json(sinhViens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API 11: Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
router.get('/cntt/dtbcao', async (req, res) => {
  try {
    const sinhVien = await SinhVien.find({ boMon: 'CNTT' })
      .sort({ diemTrungBinh: -1 })
      .limit(3);
    res.json(sinhVien);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;