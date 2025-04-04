/**
 * 应用屏幕路由枚举
 * 集中管理所有导航路径，避免硬编码字符串
 */
export enum Screens {
  // 认证相关屏幕
  LOGIN = '/',
  REGISTER = '/register',
  
  // 主要屏幕
  HOME = '/home',
  CHAT_LIST = '/chat',
  CHAT_DETAIL = '/chat/[id]',
  SETTINGS = '/settings',
  
  // 设置子屏幕
  PROFILE = '/settings/profile',
  PREFERENCES = '/settings/preferences',
  SECURITY = '/settings/security',
  
  // 其他屏幕
  NOTIFICATIONS = '/notifications',
  HELP = '/help',
  ABOUT = '/about',
  CUSTOMERS = "CUSTOMERS",
  ADMIN = "ADMIN",
} 