/**
 * 通知服务
 * 管理系统通知、连接状态变化和消息提醒
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
// 注释掉expo-notifications，因为缺少这个包
// import * as Notifications from 'expo-notifications';
import { useWebSocket, WSStatusListener } from './websocket';
import { ConnectionStatus, ConnectionQuality } from '../types';
import { nanoid } from 'nanoid';

// 通知类型
export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

// 通知接口
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    timestamp: number;
    duration?: number; // 显示时长，毫秒
    isRead: boolean;
    action?: () => void;
}

// 通知上下文
interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => string;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    unreadCount: number;
}

// 创建通知上下文
const NotificationContext = createContext<NotificationContextType | null>(null);

/**
 * 通知服务提供者组件
 */
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { status, addStatusListener, removeStatusListener, connectionQuality } = useWebSocket();
    const [lastConnectionStatus, setLastConnectionStatus] = useState<ConnectionStatus>(status);
    const [lastConnectionQuality, setLastConnectionQuality] = useState<ConnectionQuality>(connectionQuality);

    // 计算未读通知数量
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // 添加通知
    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): string => {
        const id = `notification_${nanoid(10)}`;
        const newNotification: Notification = {
            id,
            timestamp: Date.now(),
            isRead: false,
            ...notification
        };

        setNotifications(prev => [newNotification, ...prev]);

        // 如果设置了显示时长，自动移除
        if (notification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, notification.duration);
        }

        // 发送系统通知（仅在应用不在前台时）
        if (Platform.OS !== 'web') {
            // 这里简化通知逻辑，不使用 expo-notifications
            console.log('系统通知:', newNotification.title, newNotification.message);
        }

        return id;
    };

    // 移除通知
    const removeNotification = (id: string): void => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // 清空所有通知
    const clearNotifications = (): void => {
        setNotifications([]);
    };

    // 标记为已读
    const markAsRead = (id: string): void => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    // 标记所有为已读
    const markAllAsRead = (): void => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    // 监听连接状态变化
    useEffect(() => {
        const connectionListener: WSStatusListener = {
            onStatusChange: (newStatus: ConnectionStatus) => {
                // 状态发生变化时创建通知
                if (newStatus !== lastConnectionStatus) {
                    let notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> | null = null;

                    switch (newStatus) {
                        case ConnectionStatus.CONNECTED:
                            notification = {
                                title: '连接已恢复',
                                message: '与服务器的连接已成功建立',
                                type: NotificationType.SUCCESS,
                                duration: 3000,
                            };
                            break;
                        case ConnectionStatus.DISCONNECTED:
                            notification = {
                                title: '连接已断开',
                                message: '与服务器的连接已断开，正在尝试重新连接',
                                type: NotificationType.WARNING,
                            };
                            break;
                        case ConnectionStatus.CONNECTING:
                            notification = {
                                title: '正在连接',
                                message: '正在尝试与服务器建立连接',
                                type: NotificationType.INFO,
                                duration: 3000,
                            };
                            break;
                    }

                    if (notification) {
                        addNotification(notification);
                    }

                    setLastConnectionStatus(newStatus);
                }
            },
            onConnectionQualityChange: (quality: ConnectionQuality) => {
                // 连接质量变差时创建通知
                if (
                    quality !== lastConnectionQuality &&
                    (quality === ConnectionQuality.POOR || quality === ConnectionQuality.FAIR) &&
                    (lastConnectionQuality === ConnectionQuality.EXCELLENT || lastConnectionQuality === ConnectionQuality.GOOD)
                ) {
                    const notification = {
                        title: '连接质量下降',
                        message: quality === ConnectionQuality.POOR
                            ? '当前网络连接质量较差，可能会影响通信'
                            : '当前网络连接质量一般，可能会有轻微延迟',
                        type: quality === ConnectionQuality.POOR
                            ? NotificationType.WARNING
                            : NotificationType.INFO,
                        duration: 5000,
                    };

                    addNotification(notification);
                }

                setLastConnectionQuality(quality);
            }
        };

        addStatusListener(connectionListener);
        return () => removeStatusListener(connectionListener);
    }, [addStatusListener, removeStatusListener, lastConnectionStatus, lastConnectionQuality]);

    // 提供通知上下文
    const contextValue: NotificationContextType = {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
    };

    return React.createElement(
        NotificationContext.Provider,
        { value: contextValue },
        children
    );
};

/**
 * 使用通知服务的Hook
 */
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}; 