import React, { createContext, useContext, useState, useEffect } from 'react';
// @ts-ignore
import * as SecureStore from '../adapters/SecureStoreBridge';
import { AgentData, AgentStatus } from '../types';
// @ts-ignore
import { useRouter } from 'expo-router';
import { AUTH_CONFIG } from '../services/config';

// 定义上下文类型
interface AuthContextType {
  agent: AgentData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (agentId: string, agentName: string, apiKey: string) => Promise<boolean>;
  logout: () => Promise<void>;
  token: string | null;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT 令牌存储键
const TOKEN_KEY = 'customer_service_auth_token';
const AGENT_DATA_KEY = 'customer_service_agent_data';

// API密钥存储键（单独存储密钥，不作为 AgentData 的一部分）
const API_KEY_STORE = 'customer_service_api_key';

// 提供者组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // 检查用户是否已认证
  const isAuthenticated = !!token && !!agent;

  // 初始化 - 检查存储的令牌和数据
  useEffect(() => {
    async function loadStoredCredentials() {
      try {
        // 读取存储的令牌
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          
          // 读取存储的客服数据
          const storedAgentData = await SecureStore.getItemAsync(AGENT_DATA_KEY);
          if (storedAgentData) {
            setAgent(JSON.parse(storedAgentData));
          }
        }
      } catch (error) {
        console.error('加载存储的凭据时出错:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredCredentials();
  }, []);

  // 登录功能
  const login = async (agentId: string, agentName: string, apiKey: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // 实际应用中，这里应进行API调用验证凭据
      // 现在我们模拟成功响应，实际项目请替换为真实API调用
      
      // 模拟API响应延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟JWT令牌 (实际项目需要从服务器获取)
      const mockToken = `mock.jwt.token.${Date.now()}`;
      
      // 存储API密钥（不作为 AgentData 的一部分）
      await SecureStore.setItemAsync(API_KEY_STORE, apiKey);
      
      // 检查是否为管理员登录
      const isAdmin = apiKey === AUTH_CONFIG.ADMIN_API_KEY || agentId.startsWith('admin_');
      
      // 创建客服数据对象
      const agentData: AgentData = {
        id: agentId,
        name: agentName,
        status: AgentStatus.ONLINE,
        avatar: undefined, // 可选头像URL
        email: `${agentId}@example.com`, // 模拟邮箱
        activeChats: 0,
        totalResolved: 0,
        permissions: isAdmin 
          ? ['chat', 'view_customers', 'manage_agents', 'view_analytics', 'system_config', 'assign_chats'] 
          : ['chat', 'view_customers']
      };
      
      // 记录管理员登录信息
      if (isAdmin) {
        console.log(`管理员登录: ${agentId} 在 ${new Date().toISOString()}`);
      }
      
      // 存储令牌和客服数据
      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(AGENT_DATA_KEY, JSON.stringify(agentData));
      
      // 更新状态
      setToken(mockToken);
      setAgent(agentData);
      
      return true;
    } catch (error) {
      console.error('登录过程中出错:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出功能
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // 清除存储的令牌和客服数据
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(AGENT_DATA_KEY);
      await SecureStore.deleteItemAsync(API_KEY_STORE);
      
      // 重置状态
      setToken(null);
      setAgent(null);
      
      // 导航到登录页面
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('登出过程中出错:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 上下文值
  const contextValue: AuthContextType = {
    agent,
    isLoading,
    isAuthenticated,
    login,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子用于访问上下文
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  
  return context;
} 