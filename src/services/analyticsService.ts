import { 
  SessionAnalytics, 
  AgentPerformance, 
  Message, 
  ChatSession, 
  generateId 
} from '@/src/types';
import { 
  getMessages, 
  getSessions, 
  addSessionAnalytic, 
  addAgentPerformance, 
  getSessionAnalytics,
  getAgentPerformance
} from './storageService';

// 计算单个会话的分析数据
export const analyzeSession = async (sessionId: string): Promise<SessionAnalytics> => {
  try {
    // 获取会话信息
    const sessions = await getSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error(`会话 ${sessionId} 不存在`);
    }
    
    if (!session.agentId) {
      throw new Error(`会话 ${sessionId} 没有分配客服`);
    }
    
    // 获取会话消息
    const messages = await getMessages(sessionId);
    
    // 按时间排序（确保按正确顺序处理）
    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // 消息数量
    const messageCount = sortedMessages.length;
    
    // 会话持续时间（毫秒）
    const startTime = new Date(session.startTime).getTime();
    const endTime = session.endTime 
      ? new Date(session.endTime).getTime() 
      : new Date().getTime();
    const sessionDuration = endTime - startTime;
    
    // 过滤出客户消息和客服回复
    const customerMessages = sortedMessages.filter(m => m.senderType === 'customer');
    const agentMessages = sortedMessages.filter(m => m.senderType === 'agent');
    
    // 计算平均响应时间
    let totalResponseTime = 0;
    let responseCount = 0;
    
    for (let i = 0; i < customerMessages.length; i++) {
      const customerMsg = customerMessages[i];
      
      // 查找客户消息后的第一条客服回复
      const agentReply = agentMessages.find(
        m => new Date(m.timestamp) > new Date(customerMsg.timestamp)
      );
      
      if (agentReply) {
        const responseTime = new Date(agentReply.timestamp).getTime() - new Date(customerMsg.timestamp).getTime();
        totalResponseTime += responseTime;
        responseCount++;
      }
    }
    
    const avgResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;
    
    // 解决时间
    const resolutionTime = sessionDuration;
    
    // 创建分析数据对象
    const analytics: SessionAnalytics = {
      id: generateId('MESSAGE'),
      sessionId,
      agentId: session.agentId,
      responseTime: avgResponseTime,
      sessionDuration,
      messageCount,
      resolutionTime,
      customerSatisfaction: undefined, // 需要客户评价才能设置
      tags: session.tags,
      createdAt: new Date(),
    };
    
    // 保存分析数据
    await addSessionAnalytic(analytics);
    
    return analytics;
  } catch (error) {
    console.error('分析会话数据时出错:', error);
    throw error;
  }
};

// 计算客服在指定时间段内的绩效
export const calculateAgentPerformance = async (
  agentId: string,
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  date: Date = new Date()
): Promise<AgentPerformance> => {
  try {
    // 获取指定时间段的起止时间
    const { start, end } = getTimeRange(date, period);
    
    // 获取所有会话
    const sessions = await getSessions();
    
    // 筛选出时间段内由指定客服处理的已解决会话
    const agentSessions = sessions.filter(s => 
      s.agentId === agentId && 
      s.status === 'resolved' &&
      s.endTime && 
      new Date(s.endTime) >= start &&
      new Date(s.endTime) <= end
    );
    
    // 会话数量
    const sessionsHandled = agentSessions.length;
    
    if (sessionsHandled === 0) {
      // 如果没有会话，返回空绩效数据
      return {
        agentId,
        period,
        date,
        sessionsHandled: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0,
        avgSessionDuration: 0,
        satisfactionScore: 0,
        messagesPerSession: 0,
      };
    }
    
    // 获取所有会话的分析数据
    const allSessionAnalytics = await getSessionAnalytics();
    
    // 筛选出相关会话的分析数据
    const sessionAnalytics = allSessionAnalytics.filter(
      a => a.agentId === agentId && agentSessions.some(s => s.id === a.sessionId)
    );
    
    // 计算平均响应时间
    const totalResponseTime = sessionAnalytics.reduce((sum, a) => sum + a.responseTime, 0);
    const avgResponseTime = totalResponseTime / sessionAnalytics.length;
    
    // 计算平均解决时间
    const totalResolutionTime = sessionAnalytics.reduce((sum, a) => sum + a.resolutionTime, 0);
    const avgResolutionTime = totalResolutionTime / sessionAnalytics.length;
    
    // 计算平均会话持续时间
    const totalSessionDuration = sessionAnalytics.reduce((sum, a) => sum + a.sessionDuration, 0);
    const avgSessionDuration = totalSessionDuration / sessionAnalytics.length;
    
    // 计算平均满意度分数
    const ratedSessions = sessionAnalytics.filter(a => a.customerSatisfaction !== undefined);
    const satisfactionScore = ratedSessions.length > 0
      ? ratedSessions.reduce((sum, a) => sum + (a.customerSatisfaction || 0), 0) / ratedSessions.length
      : 0;
    
    // 计算每个会话的平均消息数
    const totalMessages = sessionAnalytics.reduce((sum, a) => sum + a.messageCount, 0);
    const messagesPerSession = totalMessages / sessionAnalytics.length;
    
    // 创建绩效数据对象
    const performance: AgentPerformance = {
      agentId,
      period,
      date,
      sessionsHandled,
      avgResponseTime,
      avgResolutionTime,
      avgSessionDuration,
      satisfactionScore,
      messagesPerSession,
    };
    
    // 保存绩效数据
    await addAgentPerformance(performance);
    
    return performance;
  } catch (error) {
    console.error('计算客服绩效时出错:', error);
    throw error;
  }
};

// 设置会话的客户满意度评分
export const setSessionSatisfactionScore = async (
  sessionId: string, 
  score: number
): Promise<void> => {
  try {
    // 验证评分
    if (score < 1 || score > 5) {
      throw new Error('满意度评分必须在1-5之间');
    }
    
    // 获取所有会话分析数据
    const analytics = await getSessionAnalytics();
    
    // 查找相关会话的分析数据
    const sessionAnalytic = analytics.find(a => a.sessionId === sessionId);
    
    if (!sessionAnalytic) {
      throw new Error(`找不到会话 ${sessionId} 的分析数据`);
    }
    
    // 更新满意度评分
    sessionAnalytic.customerSatisfaction = score;
    
    // 保存更新后的分析数据
    await addSessionAnalytic(sessionAnalytic);
  } catch (error) {
    console.error('设置会话满意度评分时出错:', error);
    throw error;
  }
};

// 获取指定时间段的起止时间
const getTimeRange = (date: Date, period: 'daily' | 'weekly' | 'monthly') => {
  const start = new Date(date);
  const end = new Date(date);
  
  // 重置时间为当天开始
  start.setHours(0, 0, 0, 0);
  
  switch (period) {
    case 'daily':
      // 当天结束
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'weekly':
      // 设置为本周开始（周日）
      const day = start.getDay(); // 0是周日，6是周六
      start.setDate(start.getDate() - day);
      
      // 设置为本周结束（周六）
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'monthly':
      // 设置为本月开始
      start.setDate(1);
      
      // 设置为本月结束
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // 上个月的最后一天
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
};

// 获取特定客服的关键绩效指标
export const getAgentKPIs = async (
  agentId: string,
  startDate: Date,
  endDate: Date
): Promise<any> => {
  try {
    // 获取所有绩效数据
    const allPerformance = await getAgentPerformance();
    
    // 筛选出指定时间段内的数据
    const periodPerformance = allPerformance.filter(p => 
      p.agentId === agentId &&
      new Date(p.date) >= startDate &&
      new Date(p.date) <= endDate
    );
    
    if (periodPerformance.length === 0) {
      return {
        totalSessions: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0,
        avgSatisfactionScore: 0,
        trendData: [],
      };
    }
    
    // 计算总会话数
    const totalSessions = periodPerformance.reduce((sum, p) => sum + p.sessionsHandled, 0);
    
    // 计算平均响应时间（毫秒）
    const weightedResponseTime = periodPerformance.reduce(
      (sum, p) => sum + (p.avgResponseTime * p.sessionsHandled), 0
    );
    const avgResponseTime = totalSessions > 0 ? weightedResponseTime / totalSessions : 0;
    
    // 计算平均解决时间（毫秒）
    const weightedResolutionTime = periodPerformance.reduce(
      (sum, p) => sum + (p.avgResolutionTime * p.sessionsHandled), 0
    );
    const avgResolutionTime = totalSessions > 0 ? weightedResolutionTime / totalSessions : 0;
    
    // 计算平均满意度分数
    const weightedSatisfaction = periodPerformance.reduce(
      (sum, p) => sum + (p.satisfactionScore * p.sessionsHandled), 0
    );
    const avgSatisfactionScore = totalSessions > 0 ? weightedSatisfaction / totalSessions : 0;
    
    // 生成趋势数据 (按日期排序)
    const trendData = periodPerformance
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(p => ({
        date: p.date,
        sessionsHandled: p.sessionsHandled,
        avgResponseTime: p.avgResponseTime,
        avgResolutionTime: p.avgResolutionTime,
        satisfactionScore: p.satisfactionScore,
      }));
    
    return {
      totalSessions,
      avgResponseTime,
      avgResolutionTime,
      avgSatisfactionScore,
      trendData,
    };
  } catch (error) {
    console.error('获取客服KPI数据时出错:', error);
    throw error;
  }
}; 