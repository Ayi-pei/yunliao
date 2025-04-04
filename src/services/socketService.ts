import { WSMessage, ConnectionStatus } from '@/src/types';
// @ts-ignore
import * as SecureStore from '../adapters/SecureStoreBridge';

// 类型声明
type TimeoutId = ReturnType<typeof setTimeout> | null;
type IntervalId = ReturnType<typeof setInterval> | null;

// 常量定义
const WS_API_URL = 'wss://example.com/api/ws';
const API_KEY_STORE = 'apiKey';
const AUTH_TOKEN_STORE = 'authToken';
const RECONNECT_DELAY = 3000; // 重连延迟（毫秒）
const PING_INTERVAL = 30000; // ping间隔（毫秒）

// WebSocket 管理器单例类
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private messageHandlers: Array<(message: WSMessage) => void> = [];
  private connectionStateHandlers: Array<(isConnected: boolean) => void> = [];
  private _isConnected = false;
  private isConnecting = false;
  private reconnectTimeout: TimeoutId = null;
  private pingInterval: IntervalId = null;

  // 初始化WebSocket连接
  public async initialize(): Promise<void> {
    if (this.isConnecting || this._isConnected) {
      console.log('WebSocket连接已存在或正在连接中');
      return;
    }

    this.isConnecting = true;

    try {
      // 获取WebSocket URL（带有身份验证令牌）
      const wsUrl = await this.getWebSocketUrl();

      // 创建WebSocket连接
      this.ws = new WebSocket(wsUrl);

      // 设置事件处理程序
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      console.log('WebSocket连接初始化中...');
    } catch (error) {
      console.error('初始化WebSocket失败:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  // 关闭WebSocket连接
  public close(): void {
    this.stopPingInterval();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      // 移除所有事件处理程序
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;

      // 如果连接开着，关闭它
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }

      this.ws = null;
    }

    // 更新连接状态
    if (this._isConnected) {
      this._isConnected = false;
      this.notifyConnectionStateChange();
    }

    this.isConnecting = false;
    console.log('WebSocket连接已关闭');
  }

  // 发送WebSocket消息
  public sendMessage(message: WSMessage): void {
    if (!this._isConnected || !this.ws) {
      console.error('无法发送消息：WebSocket未连接');
      throw new Error('WebSocket未连接');
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('发送WebSocket消息失败:', error);
      throw error;
    }
  }

  // 检查连接状态
  public isConnected(): boolean {
    return this._isConnected;
  }

  // 注册消息处理程序
  public registerMessageHandler(handler: (message: WSMessage) => void): () => void {
    this.messageHandlers.push(handler);

    // 返回用于注销处理程序的函数
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index !== -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  // 注册连接状态变化处理程序
  public registerConnectionStateHandler(handler: (isConnected: boolean) => void): () => void {
    this.connectionStateHandlers.push(handler);

    // 立即通知当前状态
    handler(this._isConnected);

    // 返回用于注销处理程序的函数
    return () => {
      const index = this.connectionStateHandlers.indexOf(handler);
      if (index !== -1) {
        this.connectionStateHandlers.splice(index, 1);
      }
    };
  }

  // 构建WebSocket URL（带有身份验证令牌）
  private async getWebSocketUrl(): Promise<string> {
    try {
      // 从安全存储中获取API密钥和身份验证令牌
      const apiKey = await SecureStore.getItemAsync(API_KEY_STORE);
      const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_STORE);

      if (!apiKey) {
        throw new Error('API密钥不存在');
      }

      // 构建URL，添加查询参数
      const url = new URL(WS_API_URL);
      url.searchParams.append('apiKey', apiKey);

      if (authToken) {
        url.searchParams.append('token', authToken);
      }

      return url.toString();
    } catch (error) {
      console.error('获取WebSocket URL失败:', error);
      throw error;
    }
  }

  // 处理连接打开事件
  private handleOpen(): void {
    console.log('WebSocket连接已建立');
    this._isConnected = true;
    this.isConnecting = false;

    // 通知连接状态变化
    this.notifyConnectionStateChange();

    // 开始ping间隔
    this.startPingInterval();
  }

  // 处理接收到的消息
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as WSMessage;

      // 处理ping消息
      if (message.type === 'ping') {
        this.sendMessage({
          type: 'pong',
          timestamp: Date.now()
        });
        return;
      }

      // 将消息分发给所有处理程序
      this.messageHandlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('消息处理程序发生错误:', error);
        }
      });
    } catch (error) {
      console.error('处理WebSocket消息时出错:', error);
    }
  }

  // 处理连接关闭事件
  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket连接已关闭: ${event.code} ${event.reason}`);

    // 更新状态
    this._isConnected = false;
    this.isConnecting = false;
    this.ws = null;

    // 停止ping间隔
    this.stopPingInterval();

    // 通知连接状态变化
    this.notifyConnectionStateChange();

    // 安排重新连接
    this.scheduleReconnect();
  }

  // 处理错误事件
  private handleError(event: Event): void {
    console.error('WebSocket错误:', event);

    // 连接错误可能不会触发关闭事件，因此我们手动关闭
    this.close();
  }

  // 通知所有连接状态处理程序
  private notifyConnectionStateChange(): void {
    this.connectionStateHandlers.forEach(handler => {
      try {
        handler(this._isConnected);
      } catch (error) {
        console.error('连接状态处理程序发生错误:', error);
      }
    });
  }

  // 安排重新连接
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    console.log(`计划在 ${RECONNECT_DELAY}ms 后重新连接...`);
    this.reconnectTimeout = setTimeout(() => {
      console.log('尝试重新连接...');
      this.reconnectTimeout = null;
      this.initialize();
    }, RECONNECT_DELAY);
  }

  // 开始ping间隔以保持连接活动
  private startPingInterval(): void {
    this.stopPingInterval();

    this.pingInterval = setInterval(() => {
      if (this._isConnected) {
        try {
          this.sendMessage({
            type: 'ping',
            timestamp: Date.now()
          });
        } catch (error) {
          console.error('发送ping失败:', error);
          this.close();
        }
      }
    }, PING_INTERVAL);
  }

  // 停止ping间隔
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

// 创建单例并导出
export const webSocketManager = new WebSocketManager(); 