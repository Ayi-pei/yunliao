/**
 * 应用程序配置服务
 * 管理全局配置变量和系统设置
 */

// @ts-ignore
import Constants from 'expo-constants';
import { SystemConfig } from '../types';

// 环境变量验证 - 检查必要的环境变量是否存在
const validateEnv = () => {
  const requiredVars = [
    'JWT_SECRET'
  ];

  const missingVars = requiredVars.filter(varName =>
    !getEnvVariable(varName, '')
  );

  if (missingVars.length > 0) {
    console.warn(`警告: 缺少重要环境变量: ${missingVars.join(', ')}`);
    console.log('将使用默认值或生成的随机值替代缺失的环境变量');
  } else {
    console.log('环境变量验证成功');
  }
};

// 获取环境变量，优先使用 Constants.expoConfig.extra，兼容 Expo 和常规环境变量
const getEnvVariable = (key: string, defaultValue: string = ''): string => {
  // 从 Expo 配置中获取
  if (Constants.expoConfig?.extra && Constants.expoConfig.extra[key]) {
    return Constants.expoConfig.extra[key] as string;
  }

  // 从环境变量中获取
  if (process.env[key]) {
    return process.env[key] as string;
  }

  // 返回默认值
  return defaultValue;
};

// 在应用启动时验证环境变量
validateEnv();

// 生成随机密钥 (仅用于开发环境，生产环境应使用环境变量设置)
const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

// 创建一个仅在启动时生成一次的随机密钥 (仅开发环境使用)
const DEV_JWT_SECRET = generateRandomString(32);
console.log('使用开发环境随机JWT密钥，仅用于开发环境');

// API配置
export const API_CONFIG = {
  BASE_URL: getEnvVariable('API_URL', 'http://localhost:3000'),
  WS_URL: getEnvVariable('WS_URL', 'ws://localhost:3001'),
  TIMEOUT: parseInt(getEnvVariable('API_TIMEOUT', '30000')), // API请求超时时间，单位毫秒
};

// 认证配置
export const AUTH_CONFIG = {
  // 使用环境变量的 JWT 密钥，如果不存在则使用随机生成的密钥（仅开发环境）
  JWT_SECRET: getEnvVariable('JWT_SECRET', DEV_JWT_SECRET),
  JWT_EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN', '7d'),
  // 加密存储管理员密钥 - 实际项目应从环境变量获取
  ADMIN_API_KEY: getEnvVariable('ADMIN_API_KEY', 'admin_secure_key_from_env'),
  TOKEN_KEY: 'customer_service_auth_token',
  AGENT_DATA_KEY: 'customer_service_agent_data',
  API_KEY_STORE: 'customer_service_api_key',
};

// 系统配置
export const SYSTEM_CONFIG = {
  MAX_AGENTS_PER_DAY: parseInt(getEnvVariable('MAX_AGENTS_PER_DAY', '10'), 10),
  AUTO_ASSIGN_CHATS: getEnvVariable('AUTO_ASSIGN_CHATS', 'false') === 'true',
  WORKING_HOURS_START: getEnvVariable('WORKING_HOURS_START', '09:00'),
  WORKING_HOURS_END: getEnvVariable('WORKING_HOURS_END', '18:00'),
  WORKING_TIMEZONE: getEnvVariable('WORKING_TIMEZONE', 'Asia/Shanghai'),
  WORKING_DAYS: getEnvVariable('WORKING_DAYS', '1,2,3,4,5').split(',').map(Number),
};

// 上传配置
export const UPLOAD_CONFIG = {
  MAX_SIZE: parseInt(getEnvVariable('MAX_UPLOAD_SIZE', '10485760'), 10), // 默认10MB
  ALLOWED_TYPES: [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg', 'audio/wav'
  ],
};

// 通知配置
export const NOTIFICATION_CONFIG = {
  ENABLE_EMAIL: getEnvVariable('ENABLE_EMAIL_NOTIFICATIONS', 'false') === 'true',
  ENABLE_PUSH: getEnvVariable('ENABLE_PUSH_NOTIFICATIONS', 'true') === 'true',
  ENABLE_SOUND: getEnvVariable('ENABLE_SOUND_NOTIFICATIONS', 'true') === 'true',
};

// 颜色常量
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  dark: '#1C1C1E',
  gray: '#8E8E93',
  gray2: '#AEAEB2',
  gray3: '#C7C7CC',
  gray4: '#D1D1D6',
  gray5: '#E5E5EA',
  gray6: '#F2F2F7',
  text: '#000000',
  white: '#FFFFFF',
  background: '#F2F2F7',
};

// 存储常量
export const STORAGE_KEYS = {
  THEME: 'theme_preference',
  NOTIFICATIONS: 'notifications_enabled',
  USER_SETTINGS: 'user_settings',
  CHAT_HISTORY: 'chat_history',
};

// 尺寸常量
export const SIZES = {
  padding: 16,
  radius: 12,
  avatar: {
    small: 24,
    medium: 36,
    large: 56,
  },
};

// 导出所有常量
export const APP_CONSTANTS = {
  STORAGE_KEYS,
  COLORS,
  SIZES,
};

// 系统配置
export const SYSTEM_CONFIG_OBJ: SystemConfig = {
  maxAgentsPerDay: SYSTEM_CONFIG.MAX_AGENTS_PER_DAY,
  autoAssignChats: SYSTEM_CONFIG.AUTO_ASSIGN_CHATS,
  workingHours: {
    start: SYSTEM_CONFIG.WORKING_HOURS_START,
    end: SYSTEM_CONFIG.WORKING_HOURS_END,
    timezone: SYSTEM_CONFIG.WORKING_TIMEZONE,
    workDays: SYSTEM_CONFIG.WORKING_DAYS,
  },
  notifications: {
    email: NOTIFICATION_CONFIG.ENABLE_EMAIL,
    push: NOTIFICATION_CONFIG.ENABLE_PUSH,
    sound: NOTIFICATION_CONFIG.ENABLE_SOUND,
  },
};

// 导出完整配置
export const CONFIG = {
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  SYSTEM: SYSTEM_CONFIG_OBJ,
  UPLOAD: UPLOAD_CONFIG,
  NOTIFICATION: NOTIFICATION_CONFIG,
  APP_CONSTANTS: APP_CONSTANTS,
}; 