# Web Project Backend

一个完整的用户认证系统后端，支持本地注册/登录和Google OAuth登录。

## 🚀 功能特性

- ✅ 用户注册和登录（用户名/邮箱 + 密码）
- ✅ Google OAuth 登录
- ✅ JWT Token 认证
- ✅ 密码加密存储
- ✅ 输入验证和错误处理
- ✅ 请求频率限制
- ✅ 安全中间件
- ✅ MongoDB 数据库集成

## 📁 项目结构

```
Web-Project-BE/
├── config/
│   ├── database.js          # 数据库连接配置
│   └── passport.js          # Passport 认证策略
├── controllers/
│   ├── authController.js    # 本地认证控制器
│   └── googleAuthController.js # Google OAuth 控制器
├── middleware/
│   └── auth.js              # JWT 认证中间件
├── models/
│   └── User.js              # 用户数据模型
├── routes/
│   └── auth.js              # 认证路由
├── server.js                # 主服务器文件
├── package.json             # 项目依赖
├── env.example              # 环境变量示例
└── README.md                # 项目文档
```

## 🛠️ 安装和运行

### 1. 安装依赖

```bash
cd Web-Project-BE
npm install
```

### 2. 环境配置

复制 `env.example` 文件为 `.env` 并配置环境变量：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/web-project

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=24h

# Google OAuth 配置
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 服务器配置
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. 启动 MongoDB

确保 MongoDB 服务正在运行：

```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# 或者直接启动
mongod
```

### 4. 运行服务器

```bash
# 开发模式（使用 nodemon）
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:5000` 启动。

## 📡 API 接口

### 认证接口

#### 用户注册
```http
POST /api/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123"
}
```

#### 用户登录
```http
POST /api/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123"
}
```

#### Google OAuth 登录
```http
GET /auth/google
```

#### 验证 Token
```http
GET /api/verify-token
Authorization: Bearer <your-jwt-token>
```

#### 获取用户信息
```http
GET /api/user
Authorization: Bearer <your-jwt-token>
```

### 响应格式

#### 成功响应
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "testuser",
    "email": "test@example.com",
    "authMethods": ["local"]
  }
}
```

#### 错误响应
```json
{
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

## 🔧 Google OAuth 配置

### 1. 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 配置授权重定向 URI：`http://localhost:5000/auth/google/callback`

### 2. 获取客户端凭据

- 复制 `Client ID` 和 `Client Secret`
- 在 `.env` 文件中配置：
  ```env
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  ```

## 🗄️ 数据库模型

### User 模型

```javascript
{
  username: String,        // 用户名（唯一）
  email: String,          // 邮箱（唯一）
  password: String,       // 加密密码（本地用户必需，Google用户可选）
  authMethods: [String],  // 支持的认证方式：['local', 'google']
  googleId: String,       // Google 用户 ID（可选）
  bookmarkedRecipes: [ObjectId], // 收藏的食谱
  createdAt: Date,        // 创建时间
  updatedAt: Date         // 更新时间
}
```

## 🔒 安全特性

- **密码加密**：使用 bcrypt 加密存储密码
- **JWT 认证**：安全的 token 认证机制
- **统一账户系统**：同一邮箱支持Google和本地双重认证
- **智能账户合并**：自动合并重复邮箱的认证方式

## 🎯 用户认证流程

### 场景1：先Google登录，后本地注册
1. 用户通过Google登录 → 创建账户 `{authMethods: ['google']}`
2. 用户用同一邮箱进行本地注册 → 自动为Google账户添加密码 `{authMethods: ['google', 'local']}`
3. 现在用户可以用两种方式登录同一账户

### 场景2：先本地注册，后Google登录  
1. 用户本地注册 → 创建账户 `{authMethods: ['local']}`
2. 用户用同一邮箱Google登录 → 自动合并认证方式 `{authMethods: ['local', 'google']}`
3. 现在用户可以用两种方式登录同一账户

### 场景3：重复邮箱冲突
- 如果邮箱已有完整的本地账户（有密码），拒绝重复注册
- 如果邮箱只有Google认证（无密码），允许添加本地认证
- **请求限制**：防止暴力攻击的频率限制
- **输入验证**：使用 express-validator 验证输入
- **CORS 配置**：限制跨域请求来源
- **安全头**：使用 helmet 设置安全 HTTP 头

## 🚨 错误处理

系统提供统一的错误处理机制，包括：

- 验证错误（400）
- 认证错误（401）
- 权限错误（403）
- 资源未找到（404）
- 冲突错误（409）
- 服务器错误（500）

## 📝 开发说明

### 添加新的认证提供商

1. 在 `config/passport.js` 中添加新的 Passport 策略
2. 在 `controllers/` 中创建对应的控制器
3. 在 `routes/auth.js` 中添加路由
4. 更新 `User` 模型以支持新的提供商

### 自定义验证规则

在 `routes/auth.js` 中修改 `registerValidation` 和 `loginValidation` 数组来自定义验证规则。

## 🤝 与前端集成

前端需要处理以下流程：

1. **本地登录**：发送 POST 请求到 `/api/login`
2. **Google 登录**：重定向到 `/auth/google`
3. **Token 存储**：将返回的 JWT token 存储在 localStorage
4. **请求认证**：在请求头中添加 `Authorization: Bearer <token>`

## 📞 支持

如有问题，请检查：

1. MongoDB 服务是否运行
2. 环境变量是否正确配置
3. Google OAuth 配置是否正确
4. 前端 URL 是否匹配 CORS 配置

## 📄 许可证

MIT License

