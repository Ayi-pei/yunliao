// @ts-ignore
import Constants from 'expo-constants';
import { SystemConfig } from '../types';

// 获取环境变量，优先使用 Constants.expoConfig.extra，兼容 Expo 和常规环境变量
const getEnvVariable = (key: string, defaultValue?: string): string => {
  if (Constants.expoConfig?.extra && Constants.expoConfig.extra[key]) {
    return Constants.expoConfig.extra[key] as string;
  }
  
  // 尝试获取过程环境变量
  return process.env[key] || defaultValue || '';
};

// API和WebSocket配置
export const API_CONFIG = {
  API_URL: getEnvVariable('API_URL', 'http://localhost:3000'),
  WS_URL: getEnvVariable('WS_URL', 'ws://localhost:3001'),
};

// 认证配置
export const AUTH_CONFIG = {
  JWT_SECRET: getEnvVariable('JWT_SECRET', 'default_secret_key'),
  JWT_EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN', '7d'),
  ADMIN_API_KEY: getEnvVariable('ADMIN_API_KEY', 'adminayi888'),
};

// 系统配置
export const SYSTEM_CONFIG: SystemConfig = {
  maxAgentsPerDay: parseInt(getEnvVariable('MAX_AGENTS_PER_DAY', '10'), 10),
  autoAssignChats: getEnvVariable('AUTO_ASSIGN_CHATS', 'true') === 'true',
  workingHours: {
    start: getEnvVariable('WORKING_HOURS_START', '09:00'),
    end: getEnvVariable('WORKING_HOURS_END', '18:00'),
    timezone: getEnvVariable('WORKING_TIMEZONE', 'Asia/Shanghai'),
    workDays: getEnvVariable('WORKING_DAYS', '1,2,3,4,5')
      .split(',')
      .map(day => parseInt(day, 10)),
  },
  notifications: {
    email: getEnvVariable('ENABLE_EMAIL_NOTIFICATIONS', 'true') === 'true',
    push: getEnvVariable('ENABLE_PUSH_NOTIFICATIONS', 'true') === 'true',
    sound: getEnvVariable('ENABLE_SOUND_NOTIFICATIONS', 'true') === 'true',
  },
};

// 上传配置
export const UPLOAD_CONFIG = {
  MAX_SIZE: parseInt(getEnvVariable('MAX_UPLOAD_SIZE', '10485760'), 10), // 默认10MB
  ALLOWED_TYPES: getEnvVariable('ALLOWED_FILE_TYPES', 
    'image/jpeg,image/png,image/gif,application/pdf').split(','),
};

// 导出完整配置
export const CONFIG = {
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  SYSTEM: SYSTEM_CONFIG,
  UPLOAD: UPLOAD_CONFIG,
}; 