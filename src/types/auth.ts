/**
 * 认证相关类型定义
 */

/**
 * 用户角色枚举
 */
export enum UserRole {
    ADMIN = 'admin',      // 管理员
    SUPERVISOR = 'supervisor', // 主管
    AGENT = 'agent',      // 普通客服
    TRAINEE = 'trainee'   // 培训中的客服
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
    ACTIVE = 'active',       // 活跃
    INACTIVE = 'inactive',   // 非活跃
    SUSPENDED = 'suspended', // 已暂停
    PENDING = 'pending'      // 待审核
}

/**
 * 用户权限枚举
 */
export enum Permission {
    // 系统管理权限
    MANAGE_SYSTEM = 'manage_system',       // 系统管理
    MANAGE_AGENTS = 'manage_agents',       // 管理客服
    MANAGE_SETTINGS = 'manage_settings',   // 管理设置
    VIEW_ANALYTICS = 'view_analytics',     // 查看分析数据

    // 客服操作权限
    ASSIGN_CHATS = 'assign_chats',         // 分配聊天
    TRANSFER_CHATS = 'transfer_chats',     // 转移聊天
    ACCESS_ALL_CHATS = 'access_all_chats', // 访问所有聊天

    // 基本操作权限
    SEND_MESSAGES = 'send_messages',       // 发送消息
    UPLOAD_FILES = 'upload_files',         // 上传文件
    USE_QUICK_REPLIES = 'use_quick_replies', // 使用快捷回复
    CLOSE_SESSIONS = 'close_sessions'      // 关闭会话
}

/**
 * 角色权限映射
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        Permission.MANAGE_SYSTEM,
        Permission.MANAGE_AGENTS,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_ANALYTICS,
        Permission.ASSIGN_CHATS,
        Permission.TRANSFER_CHATS,
        Permission.ACCESS_ALL_CHATS,
        Permission.SEND_MESSAGES,
        Permission.UPLOAD_FILES,
        Permission.USE_QUICK_REPLIES,
        Permission.CLOSE_SESSIONS
    ],
    [UserRole.SUPERVISOR]: [
        Permission.VIEW_ANALYTICS,
        Permission.MANAGE_AGENTS,
        Permission.ASSIGN_CHATS,
        Permission.TRANSFER_CHATS,
        Permission.ACCESS_ALL_CHATS,
        Permission.SEND_MESSAGES,
        Permission.UPLOAD_FILES,
        Permission.USE_QUICK_REPLIES,
        Permission.CLOSE_SESSIONS
    ],
    [UserRole.AGENT]: [
        Permission.SEND_MESSAGES,
        Permission.UPLOAD_FILES,
        Permission.USE_QUICK_REPLIES,
        Permission.CLOSE_SESSIONS
    ],
    [UserRole.TRAINEE]: [
        Permission.SEND_MESSAGES,
        Permission.USE_QUICK_REPLIES
    ]
};

/**
 * 用户认证信息接口
 */
export interface AuthUser {
    id: string;
    username: string;
    displayName: string;
    role: UserRole;
    status: UserStatus;
    permissions: Permission[];
    email?: string;
    avatar?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    lastLoginAt?: string;
}

/**
 * JWT载荷类型
 */
export interface JWTPayload {
    sub: string;       // 用户ID
    username: string;  // 用户名
    role: UserRole;    // 角色
    status: UserStatus; // 状态
    permissions: Permission[]; // 权限
    iat: number;       // 签发时间
    exp: number;       // 过期时间
}

/**
 * 登录请求体
 */
export interface LoginRequest {
    username: string;
    password: string;
    apiKey?: string;   // 管理员API密钥
}

/**
 * 登录响应
 */
export interface LoginResponse {
    token: string;
    user: AuthUser;
    expiresAt: number;
}

/**
 * 判断用户是否为管理员
 */
export function isAdmin(user: AuthUser | null): boolean {
    return user?.role === UserRole.ADMIN;
}

/**
 * 判断用户是否为主管
 */
export function isSupervisor(user: AuthUser | null): boolean {
    return user?.role === UserRole.SUPERVISOR || isAdmin(user);
}

/**
 * 判断用户是否有特定权限
 */
export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
    return !!user?.permissions.includes(permission);
}

/**
 * 检查用户是否有任何给定的权限
 */
export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
    if (!user || !user.permissions || permissions.length === 0) {
        return false;
    }
    return permissions.some(p => user.permissions.includes(p));
} 