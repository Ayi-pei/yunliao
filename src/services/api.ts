/**
 * API服务
 * 封装HTTP请求，提供统一的接口与后端交互
 */

import { API_CONFIG } from './config';

// 请求超时时间
const TIMEOUT = API_CONFIG.TIMEOUT || 30000;

/**
 * 封装请求方法，添加验证和错误处理
 * @param url 请求路径
 * @param options 请求选项
 * @param token JWT令牌
 */
async function fetchWithAuth(url: string, options: any = {}, token?: string): Promise<any> {
    // 完整URL
    const fullUrl = `${API_CONFIG.BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;

    // 请求头
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 添加认证令牌
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // 组合请求选项
    const fetchOptions = {
        ...options,
        headers,
    };

    // 处理超时
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), TIMEOUT);
    });

    try {
        // 发送请求并处理超时
        const response: any = await Promise.race([
            fetch(fullUrl, fetchOptions),
            timeoutPromise,
        ]);

        // 检查HTTP状态码
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `请求失败: ${response.status}`);
        }

        // 解析JSON响应
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

/**
 * 用户认证接口
 */
export const authAPI = {
    /**
     * 客服登录
     * @param agentId 客服ID
     * @param name 客服名称
     * @param apiKey API密钥
     */
    login: async (agentId: string, name: string, apiKey: string) => {
        const url = '/auth/login';
        const options = {
            method: 'POST',
            body: JSON.stringify({ agentId, name, apiKey }),
        };

        return fetchWithAuth(url, options);
    },

    /**
     * 验证令牌有效性
     * @param token JWT令牌
     */
    validateToken: async (token: string) => {
        const url = '/auth/validate';
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 更新客服资料
     * @param data 更新数据
     * @param token JWT令牌
     */
    updateProfile: async (data: any, token: string) => {
        const url = '/auth/profile';
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
        };

        return fetchWithAuth(url, options, token);
    },
};

/**
 * 聊天会话接口
 */
export const chatAPI = {
    /**
     * 获取会话列表
     * @param token JWT令牌
     */
    getSessions: async (token: string) => {
        const url = '/chat/sessions';
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 获取特定会话
     * @param sessionId 会话ID
     * @param token JWT令牌
     */
    getSession: async (sessionId: string, token: string) => {
        const url = `/chat/sessions/${sessionId}`;
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 创建新会话
     * @param customerId 客户ID
     * @param subject 会话主题
     * @param token JWT令牌
     */
    createSession: async (customerId: string, subject: string, token: string) => {
        const url = '/chat/sessions';
        const options = {
            method: 'POST',
            body: JSON.stringify({ customerId, subject }),
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 关闭会话
     * @param sessionId 会话ID
     * @param token JWT令牌
     */
    closeSession: async (sessionId: string, token: string) => {
        const url = `/chat/sessions/${sessionId}/close`;
        const options = {
            method: 'POST',
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 解决会话
     * @param sessionId 会话ID
     * @param token JWT令牌
     */
    resolveSession: async (sessionId: string, token: string) => {
        const url = `/chat/sessions/${sessionId}/resolve`;
        const options = {
            method: 'POST',
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 获取会话消息
     * @param sessionId 会话ID
     * @param offset 偏移量
     * @param limit 限制数量
     * @param token JWT令牌
     */
    getMessages: async (sessionId: string, offset: number, limit: number, token: string) => {
        const url = `/chat/sessions/${sessionId}/messages?offset=${offset}&limit=${limit}`;
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 发送消息
     * @param sessionId 会话ID
     * @param content 消息内容
     * @param type 消息类型
     * @param token JWT令牌
     */
    sendMessage: async (sessionId: string, content: string, type: string, token: string) => {
        const url = `/chat/sessions/${sessionId}/messages`;
        const options = {
            method: 'POST',
            body: JSON.stringify({ content, type }),
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 标记消息为已读
     * @param sessionId 会话ID
     * @param token JWT令牌
     */
    markAsRead: async (sessionId: string, token: string) => {
        const url = `/chat/sessions/${sessionId}/read`;
        const options = {
            method: 'POST',
        };

        return fetchWithAuth(url, options, token);
    },
};

/**
 * 客户接口
 */
export const customerAPI = {
    /**
     * 获取客户列表
     * @param token JWT令牌
     */
    getCustomers: async (token: string) => {
        const url = '/customers';
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 获取特定客户
     * @param customerId 客户ID
     * @param token JWT令牌
     */
    getCustomer: async (customerId: string, token: string) => {
        const url = `/customers/${customerId}`;
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 添加客户备注
     * @param customerId 客户ID
     * @param note 备注内容
     * @param token JWT令牌
     */
    addNote: async (customerId: string, note: string, token: string) => {
        const url = `/customers/${customerId}/notes`;
        const options = {
            method: 'POST',
            body: JSON.stringify({ note }),
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 管理客户黑名单
     * @param customerId 客户ID
     * @param blacklisted 是否加入黑名单
     * @param reason 原因
     * @param token JWT令牌
     */
    manageBlacklist: async (customerId: string, blacklisted: boolean, reason: string, token: string) => {
        const url = `/customers/${customerId}/blacklist`;
        const options = {
            method: 'POST',
            body: JSON.stringify({ blacklisted, reason }),
        };

        return fetchWithAuth(url, options, token);
    },
};

/**
 * 系统管理接口
 */
export const adminAPI = {
    /**
     * 获取系统概览
     * @param token JWT令牌
     */
    getDashboard: async (token: string) => {
        const url = '/admin/dashboard';
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 获取客服列表
     * @param token JWT令牌
     */
    getAgents: async (token: string) => {
        const url = '/admin/agents';
        return fetchWithAuth(url, {}, token);
    },

    /**
     * 创建客服账号
     * @param data 客服数据
     * @param token JWT令牌
     */
    createAgent: async (data: any, token: string) => {
        const url = '/admin/agents';
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 更新客服账号
     * @param agentId 客服ID
     * @param data 更新数据
     * @param token JWT令牌
     */
    updateAgent: async (agentId: string, data: any, token: string) => {
        const url = `/admin/agents/${agentId}`;
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 停用客服账号
     * @param agentId 客服ID
     * @param token JWT令牌
     */
    deactivateAgent: async (agentId: string, token: string) => {
        const url = `/admin/agents/${agentId}/deactivate`;
        const options = {
            method: 'POST',
        };

        return fetchWithAuth(url, options, token);
    },

    /**
     * 管理密钥
     * @param action 操作类型
     * @param data 密钥数据
     * @param token JWT令牌
     */
    manageKeys: async (action: string, data: any, token: string) => {
        const url = `/admin/keys/${action}`;
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
        };

        return fetchWithAuth(url, options, token);
    },
}; 