const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const config = require('../util/tokenConfig');
const NhanVien = require('../models/nhanvienmodole'); // Đảm bảo tên model chính xác

// Route: Lấy tất cả nhân viên
router.get('/tatcanv', async (req, res) => {
    try {
        const nhanvien = await NhanVien.find();
        res.json(nhanvien);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route: Thêm nhân viên
router.post('/themnv', async (req, res) => {
    const { name, position, gender, dob, email, address, department } = req.body;

    if (!name || !position || !gender || !dob || !email || !address || !department) {
        return res.status(400).json({ message: 'Thiếu thông tin yêu cầu' });
    }

    const newNhanVien = new NhanVien({
        name,
        position,
        gender,
        dob,
        email,
        address,
        department
    });

    try {
        const savedNhanVien = await newNhanVien.save();
        res.status(201).json(savedNhanVien);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route: Xoá nhân viên theo email
router.delete('/xoanv/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const deletedNhanVien = await NhanVien.findOneAndDelete({ email });

        if (!deletedNhanVien) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        res.status(200).json({ message: 'Nhân viên đã được xóa', nhanvien: deletedNhanVien });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route: Sửa thông tin nhân viên theo email
router.put('/suanv/:email', async (req, res) => {
    const { email } = req.params;
    const { name, position, gender, dob, address, department } = req.body;

    try {
        const updatedNhanVien = await NhanVien.findOneAndUpdate(
            { email },
            { name, position, gender, dob, address, department },
            { new: true }
        );

        if (!updatedNhanVien) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên để sửa' });
        }

        res.status(200).json(updatedNhanVien);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route: Tìm nhân viên theo tên
router.get('/timnv/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const nhanVien = await NhanVien.findOne({ name });

        if (!nhanVien) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        res.status(200).json(nhanVien);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
