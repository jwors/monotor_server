# Monitor Server API 文档

## 用户认证接口

### 1. 用户注册
- **URL**: `POST /api/users/register`
- **描述**: 注册新用户
- **请求体**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456",
  "role": "user" // 可选，默认为 "user"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user": {
      "_id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "avatar": "",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "jwt_token_here"
  }
}
```

### 2. 用户登录
- **URL**: `POST /api/users/login`
- **描述**: 用户登录（支持用户名或邮箱）
- **请求体**:
```json
{
  "username": "testuser", // 可以是用户名或邮箱
  "password": "123456"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "_id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "avatar": "",
      "isActive": true,
      "lastLogin": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "jwt_token_here"
  }
}
```

### 3. 获取用户信息
- **URL**: `GET /api/users/profile`
- **描述**: 获取当前登录用户的信息
- **请求头**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "user": {
      "_id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "avatar": "",
      "isActive": true,
      "lastLogin": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### 4. 更新用户信息
- **URL**: `PUT /api/users/profile`
- **描述**: 更新当前用户的信息
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "username": "newusername", // 可选
  "email": "newemail@example.com", // 可选
  "avatar": "http://example.com/avatar.jpg" // 可选
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "更新用户信息成功",
  "data": {
    "user": {
      // 更新后的用户信息
    }
  }
}
```

### 5. 修改密码
- **URL**: `PUT /api/users/password`
- **描述**: 修改当前用户的密码
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

## 错误响应格式
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

## 使用说明

1. 首先安装依赖：`pnpm install`
2. 复制 `.env.example` 为 `.env` 并配置数据库连接
3. 启动服务：`pnpm run dev`
4. 服务将在 http://localhost:5000 启动

## 注意事项

- 所有需要认证的接口都需要在请求头中包含 `Authorization: Bearer <token>`
- JWT Token 有效期为 7 天
- 密码会自动加密存储
- 用户名和邮箱必须唯一