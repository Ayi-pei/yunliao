# 客服聊天管理系统部署指南

本文档提供了客服聊天管理系统的完整部署指南，包括三种主要部署方式。

## 1. Expo Go 应用部署

Expo Go 应用是最简单的部署方式，适合开发和测试。

### 前置条件
- Node.js 18 或 20 版本 (不推荐使用 Node.js 22+)
- 移动设备上安装 Expo Go 应用

### 部署步骤
1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置环境变量：
   ```bash
   cp .env.example .env
   # 编辑 .env 文件配置适当的环境变量
   ```

3. 环境变量格式注意事项：
   ```bash
   # 布尔值环境变量必须使用true/false，不能使用1/0
   # 正确: AUTO_ASSIGN_CHATS=true
   # 错误: AUTO_ASSIGN_CHATS=1
   ```

4. 启动 Expo 开发服务器：
   ```bash
   npx expo start
   ```

5. 使用 Expo Go 应用扫描终端中生成的二维码

## 2. 原生应用部署 (iOS/Android)

### 前置条件
- iOS: macOS, Xcode
- Android: Android Studio, Java Development Kit
- EAS CLI: `npm install -g eas-cli`

### 部署步骤

1. 登录 Expo 账号：
   ```bash
   npx eas login
   ```

2. 配置 EAS 项目：
   ```bash
   npx eas build:configure
   ```

3. 为生产环境创建 .env.production 文件：
   ```bash
   cp .env.example .env.production
   # 编辑 .env.production 文件配置生产环境变量
   ```

4. 检查TypeScript配置：
   ```bash
   # 确保tsconfig.json包含正确的JSX和esModuleInterop配置
   npx tsc --noEmit
   ```

5. 为 iOS 构建应用：
   ```bash
   npx eas build --platform ios --profile production
   ```

6. 为 Android 构建应用：
   ```bash
   npx eas build --platform android --profile production
   ```

7. 部署到应用商店：
   ```bash
   npx eas submit --platform ios
   npx eas submit --platform android
   ```

## 3. Web 应用部署

### 前置条件
- Node.js 18 或 20 版本 (不推荐使用 Node.js 22+)
- 网络服务器或云平台 (如 Vercel, Netlify)

### 部署步骤

1. 配置 Web 环境变量：
   ```bash
   cp .env.example .env.production
   # 编辑 .env.production 文件配置生产环境变量
   ```

2. 构建 Web 应用：
   ```bash
   npm run build:web
   ```

3. 部署到静态网站托管服务：

   **Netlify 部署：**
   ```bash
   # 安装 Netlify CLI
   npm install -g netlify-cli
   
   # 部署
   netlify deploy --prod --dir web-build
   ```

   **Vercel 部署：**
   ```bash
   # 安装 Vercel CLI
   npm install -g vercel
   
   # 部署
   vercel web-build --prod
   ```

## 后端服务部署

本客服聊天系统需要后端API服务支持以下功能：

1. 用户认证和会话管理
2. WebSocket实时通信
3. 消息存储和检索
4. 文件上传和管理

### 后端部署选项

1. **自托管服务器：**
   - 安装 Node.js 和 MongoDB
   - 配置环境变量
   - 使用 PM2 进行进程管理
   
2. **容器化部署：**
   - 使用 Docker 和 Docker Compose
   - 配置网络和持久化存储
   
3. **云服务：**
   - AWS Elastic Beanstalk
   - Google Cloud Run
   - Azure App Service

详细的后端部署说明请参考后端仓库中的部署文档。

## 环境配置注意事项

1. **API端点：** 确保前端应用的 API_URL 和 WS_URL 指向正确的后端服务地址
2. **跨域设置：** 配置后端允许前端域名的跨域请求
3. **密钥安全：** 生产环境中应使用强密钥，并妥善保管
4. **SSL证书：** 生产环境应配置 HTTPS/WSS 安全通信
5. **布尔值格式：** 所有布尔值环境变量必须使用`true`/`false`文本，不能使用数字`1`/`0`
6. **JWT密钥：** 确保JWT_SECRET使用随机生成的强密钥，而不是默认的示例值
7. **Node.js版本：** 使用 Node.js 18 或 20 版本，不推荐使用 Node.js 22+（可能导致兼容性问题）
8. **适配层使用：** 当依赖库有API变更时，优先使用项目适配层而非直接修改业务代码
   - SecureStore API变更可通过适配层`SecureStoreBridge.ts`处理
   - 使用`import * as SecureStore from '../adapters/SecureStoreBridge'`替代直接导入

## TypeScript配置

确保TypeScript配置正确，以避免构建错误：

1. **JSX支持：** 在tsconfig.json中配置`"jsx": "react-jsx"`
2. **模块兼容性：** 启用`"esModuleInterop": true`以解决模块导入兼容问题
3. **路径别名：** 确保路径别名`@/*`正确映射，或使用相对路径导入
4. **类型检查：** 构建前验证TypeScript类型`npx tsc --noEmit`
5. **库检查：** 对第三方库类型冲突使用`skipLibCheck`选项
6. **API兼容性：** 使用项目提供的适配层处理第三方库版本变更
   ```typescript
   // 使用适配层而非直接导入
   import * as SecureStore from '../adapters/SecureStoreBridge';
   // 而不是
   import * as SecureStore from 'expo-secure-store';
   ```

### 路径别名问题解决方案

如果在使用`@/`路径别名时遇到解析问题，请使用以下解决方案：

```typescript
// 例如，将这个：
import { something } from '@/assets/images/icon.png';

// 改为这个（使用相对路径）：
import { something } from '../../assets/images/icon.png';
```

或者，确保在项目的babel.config.js和tsconfig.json中正确配置了路径别名：

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Socket.io-client配置注意

当使用Socket.io-client库时，如遇导入问题，可尝试以下解决方案：

```typescript
// 方法1：使用require方式导入
const io = require('socket.io-client');

// 方法2：确保启用了esModuleInterop
import io from 'socket.io-client';

// 方法3：使用命名导入
import { io } from 'socket.io-client';
```

## 包版本更新

如果在启动项目时收到包版本不匹配的警告，可以运行以下命令更新到兼容版本：

```bash
npx expo install
```

这将更新项目依赖到与当前Expo版本最兼容的版本，避免潜在的兼容性问题。

## 性能优化建议

1. 启用内容压缩
2. 配置合适的缓存策略
3. 使用 CDN 加速静态资源
4. 实现消息分页和懒加载
5. 配置服务工作线程提升离线体验

## 故障排除

如遇部署问题，请查看以下常见解决方案：

1. **网络连接问题：** 检查API端点配置和网络连接
2. **认证失败：** 验证JWT密钥配置
3. **WebSocket断连：** 检查连接超时设置和心跳机制
4. **文件上传失败：** 检查上传限制配置 
5. **环境变量错误：** 确保所有布尔值环境变量使用`true`/`false`而非`1`/`0`
6. **TypeScript错误：** 检查JSX配置和导入路径兼容性
7. **资源路径错误：** 将`@/assets/...`改为使用相对路径`../../assets/...`
8. **端口占用问题：** 如果8081端口被占用，使用`npx kill-port 8081`释放端口
9. **SecureStore版本错误：** 如遇`getValueWithKeyAsync is not a function`错误，可选择：
   - 降级SecureStore：`npx expo install expo-secure-store@12.8.1`
   - 使用项目提供的适配层：`import * as SecureStore from '../adapters/SecureStoreBridge'`
   - 检查项目已正确配置SecureStoreBridge适配层
   - 注意：`ALWAYS`和`ALWAYS_THIS_DEVICE_ONLY`常量已通过适配层解决弃用警告：
     - 适配层内部将这些常量映射到`AFTER_FIRST_UNLOCK`和`AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`
     - 这种替代方案同时提供了更安全的实现，并保持了API兼容性
     - 代码中可以继续使用原有常量，但底层实现已使用更安全的选项
10. **Web平台样式警告：** 如果在Web环境中遇到shadow*样式属性废弃警告：
    - 使用条件样式为Web平台提供boxShadow替代：
      ```javascript
      // 正确处理跨平台阴影
      style={{
        ...(Platform.OS === 'web' ? {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        } : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }),
        elevation: 2, // Android兼容性
      }}
      ```

11. **图片选择器API警告：** 如果遇到ImagePicker的MediaTypeOptions废弃警告：
    - 使用新的MediaType API格式替代：
      ```javascript
      // 替换：
      // mediaTypes: ImagePicker.MediaTypeOptions.Images
      
      // 使用：
      mediaTypes: ['images'] // 使用字符串数组指定媒体类型
      ```

12. **消息加载循环问题：** 如果"加载更多消息..."一直循环刷新：
    - 实现边界检查和分页逻辑，确保有结束条件：
      ```javascript
      // 添加跟踪状态变量
      const [hasMoreMessages, setHasMoreMessages] = useState(true);
      
      // 在加载函数中更新状态
      const loadMoreMessages = async () => {
        // 检查是否还有更多消息
        if (!hasMoreMessages) return;
        
        // 加载逻辑...
        // 根据返回结果更新hasMoreMessages状态
        setHasMoreMessages(result.hasMore);
      };
      
      // 在UI中添加条件
      {isLoadingMore && hasMoreMessages ? (
        <LoadingIndicator message="加载更多消息..." />
      ) : null}
      ```