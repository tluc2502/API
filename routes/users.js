var express = require('express');
var router = express.Router();
const JwtToken = require('jsonwebtoken');
const config = require('../util/tokenConfig');
const user = require('../models/usermodels');

// GET all users
router.get('/all', async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy thông tin chi tiết của một người dùng
router.get('/detail', async function (req, res) {
  try {
    const { id } = req.query;
    const detail = await user.findById(id);
    if (detail) {
      res.status(200).json(detail);
    } else {
      res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Login
router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    const users = await user.findOne({ username, password });
    if (!user) {
      res.status(404).json({ status: false, message: 'Invalid username or password' });
    } else {
      const token = JwtToken.sign({ username,password }, config.SECRETKEY, { expiresIn: '1h' });
      res.json({ status: true, message: 'Thành công', data: users, token });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Đăng ký người dùng mới
router.post('/register', async function (req, res) {
  try {
    const { username, password, fullname } = req.body;

    // Kiểm tra tên người dùng đã tồn tại
    const existingUser = await user.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: false, message: 'Tên người dùng đã tồn tại' });
    }

    // Tạo người dùng mới
    const newUser = new user({ username, password, fullname });
    await newUser.save();

    res.status(201).json({ status: true, message: 'Đăng ký thành công', user: newUser });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Cập nhật thông tin người dùng
router.put('/update', async function (req, res) {
  try {
    const { id, username, fullname } = req.body;
    const updatedUser = await user.findByIdAndUpdate(
      id,
      { username, fullname },
      { new: true }
    );

    if (updatedUser) {
      res.json({ status: true, message: 'Cập nhật thành công', user: updatedUser });
    } else {
      res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Xóa người dùng
router.delete('/delete', async function (req, res) {
  try {
    const { id } = req.query;
    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) {
      res.json({ status: true, message: 'Xóa người dùng thành công' });
    } else {
      res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Tìm kiếm người dùng theo tên
router.get('/search', async function (req, res) {
  try {
    const { username } = req.query;
    const foundUser = await User.findOne({ username });

    if (foundUser) {
      res.json({ status: true, user: foundUser });
    } else {
      res.status(404).json({ status: false, message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
