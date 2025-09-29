# 图片服务迁移完成指南

## 📁 文件结构

```
Web-Project-BE/
  public/
    images/
      ingredients/          # 食材图片
        ├── Beef Bones.png
        ├── Fish Sauce.png
        ├── Ginger.png
        └── ...
      recipes/              # 食谱图片
        ├── pho receipe.png
        ├── bulgogi receipe.png
        └── ...
```

## 🔗 API 端点

后端现在提供静态图片服务：

### 基础URL
```
http://localhost:5001/api/images/
```

### 图片访问路径
- **食材图片**: `/api/images/ingredients/{图片名称}`
- **食谱图片**: `/api/images/recipes/{图片名称}`

### 示例
```
GET http://localhost:5001/api/images/ingredients/Beef Bones.png
GET http://localhost:5001/api/images/recipes/pho receipe.png
```

## 📊 数据库更新

`importRecipesAndIngredients.js` 中的图片路径已更新：

**之前**:
```javascript
image: "/assets/ingredients/Beef Bones.png"
image: "/src/assets/pho receipe.png"
```

**现在**:
```javascript
image: "/api/images/ingredients/Beef Bones.png"
image: "/api/images/recipes/pho receipe.png"
```

## 🚀 前端使用

前端现在可以直接使用这些API路径：

```javascript
// 在React组件中
<img src="http://localhost:5001/api/images/ingredients/Beef Bones.png" alt="Beef Bones" />

// 或者使用相对路径（如果配置了代理）
<img src="/api/images/recipes/pho receipe.png" alt="Pho Recipe" />
```

## ⚙️ 运行导入脚本

要将更新的数据导入数据库：

```bash
cd Web-Project-BE
node scripts/importRecipesAndIngredients.js
```

## 🌐 测试图片服务

启动后端服务器后，在浏览器中访问：
- http://localhost:5001/api/images/ingredients/Beef%20Bones.png
- http://localhost:5001/api/images/recipes/pho%20receipe.png

## 📝 注意事项

1. **文件名**: 确保图片文件名与数据库中的路径完全匹配
2. **空格**: URL中的空格会被编码为 `%20`
3. **CORS**: 已配置CORS允许前端访问图片
4. **缓存**: 浏览器会缓存图片，提高加载性能

## 🔄 前后端协作

- **后端**: 提供 `/api/images/*` 静态文件服务
- **前端**: 使用完整URL或配置代理访问图片
- **数据库**: 存储相对于API的图片路径