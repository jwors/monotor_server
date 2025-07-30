import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT中间件
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '访问令牌缺失',
        data: null
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在或已被禁用',
        data: null
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      code: 403,
      message: '无效的访问令牌',
      data: null
    });
  }
};

// 管理员权限中间件
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: '需要管理员权限',
      data: null
    });
  }
  next();
};

// 生成JWT令牌
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};