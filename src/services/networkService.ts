// @ts-ignore
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import { ConnectionStatus } from '@/src/types';
import { getSessions, getOfflineQueue, addToOfflineQueue, removeFromOfflineQueue } from './storageService';
import { webSocketManager } from './socketService';

// 网络状态监听器
let netInfoSubscription: NetInfoSubscription | null = null;

// 网络状态变化回调函数
type NetworkStatusCallback = (status: ConnectionStatus) => void;
const statusCallbacks: NetworkStatusCallback[] = [];

// 当前网络状态
let currentStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;

/**
 * 初始化网络监控
 */
export const initNetworkMonitoring = (): void => {
  if (netInfoSubscription) return;

  netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
  
  // 初始获取一次网络状态
  NetInfo.fetch().then(handleNetworkChange);
};

/**
 * 停止网络监控
 */
export const stopNetworkMonitoring = (): void => {
  if (netInfoSubscription) {
    netInfoSubscription();
    netInfoSubscription = null;
  }
};

/**
 * 处理网络状态变化
 * @param state 网络状态信息
 */
const handleNetworkChange = (state: NetInfoState): void => {
  // 更新当前状态
  const newStatus = state.isConnected 
    ? ConnectionStatus.CONNECTED 
    : ConnectionStatus.DISCONNECTED;
  
  // 如果状态发生变化，通知所有回调
  if (newStatus !== currentStatus) {
    currentStatus = newStatus;
    
    // 通知所有注册的回调
    statusCallbacks.forEach(callback => callback(currentStatus));
    
    // 如果网络恢复连接，尝试同步离线数据
    if (newStatus === ConnectionStatus.CONNECTED) {
      syncOfflineData();
    }
  }
};

/**
 * 注册网络状态变化回调
 * @param callback 回调函数
 * @returns 取消注册的函数
 */
export const registerNetworkStatusCallback = (
  callback: NetworkStatusCallback
): () => void => {
  statusCallbacks.push(callback);
  
  // 立即通知当前状态
  callback(currentStatus);
  
  // 返回取消注册的函数
  return () => {
    const index = statusCallbacks.indexOf(callback);
    if (index !== -1) {
      statusCallbacks.splice(index, 1);
    }
  };
};

/**
 * 获取当前网络连接状态
 * @returns 当前网络状态
 */
export const getCurrentNetworkStatus = (): ConnectionStatus => {
  return currentStatus;
};

/**
 * 是否处于联网状态
 * @returns 是否联网
 */
export const isOnline = (): boolean => {
  return currentStatus === ConnectionStatus.CONNECTED;
};

/**
 * 同步离线数据
 */
export const syncOfflineData = async (): Promise<void> => {
  try {
    // 检查是否联网
    if (!isOnline()) {
      console.log('无法同步离线数据：网络未连接');
      return;
    }
    
    // 检查WebSocket连接
    if (!webSocketManager.isConnected()) {
      console.log('无法同步离线数据：WebSocket未连接');
      return;
    }
    
    // 获取离线队列
    const offlineQueue = await getOfflineQueue();
    
    if (offlineQueue.length === 0) {
      console.log('离线队列为空，无需同步');
      return;
    }
    
    console.log(`开始同步${offlineQueue.length}条离线消息`);
    
    // 按照时间顺序处理离线消息
    const sortedQueue = [...offlineQueue].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    for (const offlineMessage of sortedQueue) {
      try {
        // 使用WebSocket发送消息
        webSocketManager.sendMessage({
          type: 'message',
          payload: {
            ...offlineMessage,
            isOffline: false,
            syncStatus: 'synced',
          },
          timestamp: Date.now(),
          sender: 'agent'
        });
        
        // 从离线队列中移除
        await removeFromOfflineQueue(offlineMessage.id);
        
        console.log(`成功同步离线消息: ${offlineMessage.id}`);
      } catch (error) {
        console.error(`同步离线消息失败: ${offlineMessage.id}`, error);
      }
    }
    
    console.log('离线消息同步完成');
  } catch (error) {
    console.error('同步离线数据时出错:', error);
  }
};

/**
 * 添加消息到离线队列
 * @param message 要添加的消息
 */
export const queueOfflineMessage = async (message: any): Promise<void> => {
  try {
    // 添加到离线队列
    await addToOfflineQueue({
      ...message,
      isOffline: true,
      syncStatus: 'pending',
      offlineId: message.id,
    });
    
    console.log(`消息已添加到离线队列: ${message.id}`);
  } catch (error) {
    console.error('添加消息到离线队列时出错:', error);
  }
};

// 自动初始化网络监控
initNetworkMonitoring(); 