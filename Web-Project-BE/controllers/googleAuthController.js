const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Google OAuth 成功回调处理
const googleCallback = async (req, res) => {
  try {
    console.log('Google callback triggered'); // 调试日志
    console.log('User from Google:', req.user); // 调试日志
    console.log('Frontend URL:', process.env.FRONTEND_URL); // 调试日志

    if (!req.user) {
      console.log('No user found in request'); // 调试日志
      return res.redirect(`${process.env.FRONTEND_URL}/#/login?error=google_auth_failed`);
    }

    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    console.log('Processing Google user:', email); // 调试日志

    // 首先查找是否已有相同邮箱的用户
    let user = await User.findOne({ email });

    if (!user) {
      // 邮箱不存在，创建新的Google用户
      user = new User({
        username: displayName || email.split('@')[0],
        email,
        googleId: id,
        authMethods: ['google']
      });
      await user.save();
      console.log('创建新的Google用户:', user.email);
    } else {
      // 邮箱已存在，合并Google认证
      if (!user.googleId) {
        // 用户之前只有本地认证，现在添加Google认证
        await user.mergeGoogleAccount(id, email);
        console.log('将Google认证合并到现有账户:', user.email);
      } else if (user.googleId !== id) {
        // 邮箱已经被其他Google账户使用
        console.log('Email already linked to different Google account'); // 调试日志
        const frontendUrl = process.env.FRONTEND_URL || '';
        const redirectUrl = frontendUrl ?
          `${frontendUrl}/#/login?error=email_already_linked_to_different_google_account` :
          `/#/login?error=email_already_linked_to_different_google_account`;
        return res.redirect(redirectUrl);
      }
      // 如果 googleId 相同，则是同一个用户，无需操作
    }

    // 生成JWT token
    const token = generateToken(user._id);
    console.log('Generated token for user:', user.email); // 调试日志

    // 重定向到前端，携带token
    // 由于前端和后端在同一域名，使用相对路径
    const frontendUrl = process.env.FRONTEND_URL || '';
    const redirectUrl = frontendUrl ?
      `${frontendUrl}/#/login?token=${token}&success=google_login` :
      `/#/login?token=${token}&success=google_login`;

    console.log('Redirecting to:', redirectUrl); // 调试日志
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || '';
    const redirectUrl = frontendUrl ?
      `${frontendUrl}/#/login?error=google_auth_failed` :
      `/#/login?error=google_auth_failed`;
    res.redirect(redirectUrl);
  }
};

// 验证Google token（用于前端验证）
const verifyGoogleToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        valid: false,
        message: 'No token provided'
      });
    }

    // 验证JWT token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 查找用户
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        valid: false,
        message: 'User not found'
      });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        authMethods: user.authMethods
      }
    });

  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(401).json({
      valid: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  googleCallback,
  verifyGoogleToken
};

