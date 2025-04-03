import io from 'socket.io-client';
import { API_CONFIG } from './config';
import { getAuthToken } from './auth';
import { WSMessage } from '../types';

// 使用any临时解决类型问题
let socket: any = null;

// 初始化WebSocket连接
export const initializeSocket = async (): Promise<any> => {
  if (socket) {
    return socket;
  }

  // 获取认证令牌
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('用户未认证，无法建立WebSocket连接');
  }

  // 创建Socket.io客户端实例
  socket = io(API_CONFIG.WS_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
    autoConnect: true,
  });

  // 连接事件处理
  socket.on('connect', () => {
    console.log('WebSocket连接已建立');
  });

  // 连接错误处理
  socket.on('connect_error', (error: Error) => {
    console.error('WebSocket连接错误:', error);
  });

  // 断开连接处理
  socket.on('disconnect', (reason: string) => {
    console.log('WebSocket连接已断开:', reason);
  });

  return socket;
};

// 断开WebSocket连接
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// 发送消息
export const sendMessage = (message: WSMessage): void => {
  if (!socket || !socket.connected) {
    console.error('WebSocket未连接，无法发送消息');
    return;
  }

  socket.emit('message', message);
};

// 发送正在输入状态
export const sendTypingStatus = (isTyping: boolean, chatId: string): void => {
  if (!socket || !socket.connected) {
    return;
  }

  socket.emit('typing', { isTyping, chatId });
};

// 发送已读状态
export const sendReadStatus = (messageIds: string[], sessionId: string): void => {
  if (!socket || !socket.connected) {
    return;
  }

  socket.emit('read', { messageIds, sessionId });
};

// 监听消息
export const onMessage = (callback: (message: WSMessage) => void): void => {
  if (!socket) {
    return;
  }

  socket.on('message', callback);
};

// 监听输入状态
export const onTyping = (callback: (data: { isTyping: boolean, userId: string, chatId: string }) => void): void => {
  if (!socket) {
    return;
  }

  socket.on('typing', callback);
};

// 监听已读状态
export const onRead = (callback: (data: { messageIds: string[], sessionId: string }) => void): void => {
  if (!socket) {
    return;
  }

  socket.on('read', callback);
};

// 监听用户状态变化
export const onUserStatusChange = (callback: (data: { userId: string, status: string }) => void): void => {
  if (!socket) {
    return;
  }

  socket.on('status', callback);
};

// 清除所有监听器
export const clearListeners = (): void => {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
}; 