const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// 用户注册
const register = async (req, res) => {
  try {
    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // 检查用户名是否已存在
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(409).json({
        message: 'Username already taken',
        code: 'USERNAME_EXISTS'
      });
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
      // 如果邮箱已存在但只有Google认证（没有本地密码），允许添加本地认证
      if (existingUserByEmail.googleId && !existingUserByEmail.password) {
        // 为现有Google用户添加本地认证
        existingUserByEmail.password = password;
        existingUserByEmail.addAuthMethod('local');
        await existingUserByEmail.save();

        const token = generateToken(existingUserByEmail._id);

        return res.status(200).json({
          message: 'Local authentication added to existing Google account',
          token,
          user: {
            id: existingUserByEmail._id,
            username: existingUserByEmail.username,
            email: existingUserByEmail.email,
            authMethods: existingUserByEmail.authMethods,
            createdAt: existingUserByEmail.createdAt
          }
        });
      } else {
        // 邮箱已被其他账户使用（有本地密码或没有Google ID）
        return res.status(409).json({
          message: 'Email already registered',
          code: 'EMAIL_EXISTS'
        });
      }
    }    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      authMethods: ['local']
    });

    await user.save();

    // 生成JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        authMethods: user.authMethods,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 生成JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        authMethods: user.authMethods
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    // 使用 populate 来获取收藏的食谱信息
    const user = await User.findById(req.user._id).populate('bookmarkedRecipes');

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      authMethods: user.authMethods,
      createdAt: user.createdAt,
      bookmarkedRecipes: user.bookmarkedRecipes
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

// 验证token
const verifyToken = async (req, res) => {
  try {
    // 如果到达这里，说明token是有效的（通过了authenticateToken中间件）
    res.json({
      valid: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        authMethods: req.user.authMethods
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  verifyToken
};

