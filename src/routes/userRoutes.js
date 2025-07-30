import express from 'express';
import User from '../models/User.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';

const router = express.Router();

// 用户注册接口
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名、邮箱和密码为必填项',
        data: null
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名或邮箱已存在',
        data: null
      });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    // 生成JWT令牌
    const token = generateToken(user._id);

    res.status(201).json({
      code: 200,
      message: '注册成功',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 用户登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码为必填项',
        data: null
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      });
    }

    // 更新最后登录时间
    user.lastLogin = new Date();
    await user.save();

    // 生成JWT令牌
    const token = generateToken(user._id);

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 获取当前用户信息接口
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      code: 200,
      message: '获取用户信息成功',
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 更新用户信息接口
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const userId = req.user._id;

    // 检查用户名和邮箱是否被其他用户使用
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          code: 400,
          message: '用户名或邮箱已被其他用户使用',
          data: null
        });
      }
    }

    // 更新用户信息
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      code: 200,
      message: '更新用户信息成功',
      data: {
        user: updatedUser.toJSON()
      }
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 修改密码接口
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        message: '当前密码和新密码为必填项',
        data: null
      });
    }

    const user = await User.findById(req.user._id);
    
    // 验证当前密码
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '当前密码错误',
        data: null
      });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({
      code: 200,
      message: '密码修改成功',
      data: null
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

export default router;