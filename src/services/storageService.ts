// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Customer, ChatSession, QuickReply, generateId } from '@/src/types';

// 存储键前缀
const STORAGE_KEYS = {
  MESSAGES: '@cs_messages_', // 会话消息 @cs_messages_{sessionId}
  SESSIONS: '@cs_sessions',  // 所有会话
  CUSTOMERS: '@cs_customers', // 所有客户
  QUICK_REPLIES: '@cs_quick_replies', // 快捷回复
  OFFLINE_QUEUE: '@cs_offline_queue', // 离线消息队列
  SESSION_ANALYTICS: '@cs_analytics_sessions', // 会话分析数据
  AGENT_PERFORMANCE: '@cs_analytics_performance', // 客服绩效数据
};

// 最大缓存消息数量（每个会话）
const MAX_CACHED_MESSAGES = 100;

// 初始化存储
export const initStorage = async (): Promise<void> => {
  try {
    // 检查是否已初始化
    const initialized = await AsyncStorage.getItem('@cs_initialized');
    if (initialized) return;

    // 初始化存储
    await AsyncStorage.setItem('@cs_initialized', 'true');
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    await AsyncStorage.setItem(STORAGE_KEYS.QUICK_REPLIES, JSON.stringify([]));
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ANALYTICS, JSON.stringify([]));
    await AsyncStorage.setItem(STORAGE_KEYS.AGENT_PERFORMANCE, JSON.stringify([]));

    console.log('存储初始化完成');
  } catch (error) {
    console.error('初始化存储时发生错误:', error);
  }
};

// 消息操作 ==================================================

// 保存消息
export const saveMessages = async (sessionId: string, messages: Message[]): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.MESSAGES}${sessionId}`;
    await AsyncStorage.setItem(key, JSON.stringify(messages));
  } catch (error) {
    console.error('保存消息时发生错误:', error);
    throw error;
  }
};

// 获取消息
export const getMessages = async (sessionId: string): Promise<Message[]> => {
  try {
    const key = `${STORAGE_KEYS.MESSAGES}${sessionId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取消息时发生错误:', error);
    return [];
  }
};

// 添加新消息
/**
 * 添加新消息
 * @param sessionId 会话ID
 * @param message 消息对象
 */
export const addMessage = async (sessionId: string, message: Message): Promise<void> => {
  try {
    // 获取会话的所有消息
    const messages = await getMessages(sessionId);
    
    // 添加新消息
    messages.push(message);
    
    // 如果消息超过最大缓存数量，移除最早的消息
    if (messages.length > MAX_CACHED_MESSAGES) {
      messages.shift();
    }
    
    // 保存更新后的消息列表
    await saveMessages(sessionId, messages);
  } catch (error) {
    console.error('添加消息时出错:', error);
    throw error;
  }
};

// 更新消息状态
export const updateMessage = async (
  sessionId: string,
  messageId: string,
  updates: Partial<Message>
): Promise<void> => {
  try {
    // 获取会话的所有消息
    const messages = await getMessages(sessionId);
    
    // 查找要更新的消息
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      throw new Error(`消息不存在: ${messageId}`);
    }
    
    // 更新消息
    messages[messageIndex] = {
      ...messages[messageIndex],
      ...updates,
    };
    
    // 保存更新后的消息列表
    await saveMessages(sessionId, messages);
  } catch (error) {
    console.error('更新消息状态时出错:', error);
    throw error;
  }
};

// 会话操作 ==================================================

// 保存所有会话
export const saveSessions = async (sessions: ChatSession[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('保存会话时发生错误:', error);
    throw error;
  }
};

// 获取所有会话
export const getSessions = async (): Promise<ChatSession[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取会话时发生错误:', error);
    return [];
  }
};

// 添加会话
export const addSession = async (session: ChatSession): Promise<void> => {
  try {
    const sessions = await getSessions();
    sessions.push(session);
    await saveSessions(sessions);
  } catch (error) {
    console.error('添加会话时发生错误:', error);
    throw error;
  }
};

// 更新会话
export const updateSession = async (
  sessionUpdates: Partial<ChatSession> & { id: string }
): Promise<void> => {
  try {
    // 获取所有会话
    const sessions = await getSessions();
    
    // 查找要更新的会话
    const sessionIndex = sessions.findIndex(s => s.id === sessionUpdates.id);
    
    if (sessionIndex === -1) {
      throw new Error(`会话不存在: ${sessionUpdates.id}`);
    }
    
    // 更新会话
    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      ...sessionUpdates,
    };
    
    // 保存更新后的会话列表
    await saveSessions(sessions);
  } catch (error) {
    console.error('更新会话信息时出错:', error);
    throw error;
  }
};

// 更新会话的最后消息
const updateSessionLastMessage = async (sessionId: string, message: Message): Promise<void> => {
  try {
    const sessions = await getSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      const updatedSession = { 
        ...session, 
        lastMessageTime: new Date(message.timestamp),
        // 如果是客户发送的消息，增加未读数
        unreadCount: message.senderType === 'customer' ? 
          (session.unreadCount || 0) + 1 : session.unreadCount
      };
      
      await updateSession(updatedSession);
    }
  } catch (error) {
    console.error('更新会话最后消息时发生错误:', error);
  }
};

// 客户操作 ==================================================

// 保存所有客户
export const saveCustomers = async (customers: Customer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (error) {
    console.error('保存客户时发生错误:', error);
    throw error;
  }
};

// 获取所有客户
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取客户时发生错误:', error);
    return [];
  }
};

// 添加客户
export const addCustomer = async (customer: Customer): Promise<void> => {
  try {
    const customers = await getCustomers();
    customers.push(customer);
    await saveCustomers(customers);
  } catch (error) {
    console.error('添加客户时发生错误:', error);
    throw error;
  }
};

// 更新客户
export const updateCustomer = async (updatedCustomer: Customer): Promise<void> => {
  try {
    const customers = await getCustomers();
    const updatedCustomers = customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    
    await saveCustomers(updatedCustomers);
  } catch (error) {
    console.error('更新客户时发生错误:', error);
    throw error;
  }
};

// 离线队列操作 ==================================================

// 添加离线消息到队列
export const addToOfflineQueue = async (message: Message): Promise<void> => {
  try {
    // 为离线消息生成临时ID
    const offlineMessage = {
      ...message,
      offlineId: generateId('MESSAGE'),
      isOffline: true,
      syncStatus: 'pending' as const
    };
    
    const queue = await getOfflineQueue();
    queue.push(offlineMessage);
    
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    
    // 同时保存到本地消息中
    await addMessage(message.sessionId, message);
  } catch (error) {
    console.error('添加消息到离线队列时发生错误:', error);
    throw error;
  }
};

// 获取离线消息队列
export const getOfflineQueue = async (): Promise<Message[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取离线队列时发生错误:', error);
    return [];
  }
};

// 从离线队列中移除消息
export const removeFromOfflineQueue = async (offlineId: string): Promise<void> => {
  try {
    const queue = await getOfflineQueue();
    const updatedQueue = queue.filter(msg => msg.offlineId !== offlineId);
    
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(updatedQueue));
  } catch (error) {
    console.error('从离线队列中移除消息时发生错误:', error);
    throw error;
  }
};

// 快捷回复操作 ==================================================

// 保存所有快捷回复
export const saveQuickReplies = async (quickReplies: QuickReply[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.QUICK_REPLIES, JSON.stringify(quickReplies));
  } catch (error) {
    console.error('保存快捷回复时发生错误:', error);
    throw error;
  }
};

// 获取所有快捷回复
export const getQuickReplies = async (): Promise<QuickReply[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.QUICK_REPLIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取快捷回复时发生错误:', error);
    return [];
  }
};

// 数据清理 ==================================================

// 清除过期数据(清理超过30天的消息)
export const cleanupExpiredData = async (): Promise<void> => {
  try {
    // 获取30天前的日期
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // 获取所有会话
    const sessions = await getSessions();
    
    // 筛选出已解决的且结束时间超过30天的会话
    const expiredSessionIds = sessions
      .filter(session => 
        session.status === 'resolved' && 
        session.endTime && 
        new Date(session.endTime) < thirtyDaysAgo
      )
      .map(session => session.id);
    
    // 删除过期会话的消息
    for (const sessionId of expiredSessionIds) {
      await AsyncStorage.removeItem(`${STORAGE_KEYS.MESSAGES}${sessionId}`);
    }
    
    // 更新会话列表，移除过期会话
    const updatedSessions = sessions.filter(
      session => !expiredSessionIds.includes(session.id)
    );
    await saveSessions(updatedSessions);
    
    console.log(`清理了 ${expiredSessionIds.length} 个过期会话`);
  } catch (error) {
    console.error('清理过期数据时发生错误:', error);
  }
};

// 分析数据操作 ==================================================

// 保存会话分析数据
export const saveSessionAnalytics = async (analytics: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ANALYTICS, JSON.stringify(analytics));
  } catch (error) {
    console.error('保存会话分析数据时发生错误:', error);
    throw error;
  }
};

// 获取会话分析数据
export const getSessionAnalytics = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_ANALYTICS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取会话分析数据时发生错误:', error);
    return [];
  }
};

// 添加会话分析数据
export const addSessionAnalytic = async (analytic: any): Promise<void> => {
  try {
    const analytics = await getSessionAnalytics();
    analytics.push(analytic);
    await saveSessionAnalytics(analytics);
  } catch (error) {
    console.error('添加会话分析数据时发生错误:', error);
    throw error;
  }
};

// 保存客服绩效数据
export const saveAgentPerformance = async (performance: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AGENT_PERFORMANCE, JSON.stringify(performance));
  } catch (error) {
    console.error('保存客服绩效数据时发生错误:', error);
    throw error;
  }
};

// 获取客服绩效数据
export const getAgentPerformance = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.AGENT_PERFORMANCE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取客服绩效数据时发生错误:', error);
    return [];
  }
};

// 添加客服绩效数据
export const addAgentPerformance = async (performance: any): Promise<void> => {
  try {
    const performances = await getAgentPerformance();
    performances.push(performance);
    await saveAgentPerformance(performances);
  } catch (error) {
    console.error('添加客服绩效数据时发生错误:', error);
    throw error;
  }
}; 