import { AuthProvider } from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NotificationBanner from './src/components/NotificationBanner';
import ConnectionStatusIndicator from './src/components/ConnectionStatus';
import SyncStatus from './src/components/SyncStatus';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

// 组件导入检查
const componentsStatus = {
    authProvider: true,
    connectionStatus: true,
    notificationBanner: true,
    syncStatus: true
};

// 导入服务，但不直接引用可能有问题的类型或函数
let encryptionService: any;
let syncManager: any;
let syncService: any;
let webSocketManager: any;
let socketService: any;

try {
    encryptionService = require('./src/services/encryptionService');
} catch (e) {
    console.error('无法加载加密服务:', e);
}

try {
    syncManager = require('./src/services/syncManager');
} catch (e) {
    console.error('无法加载同步管理器:', e);
}

try {
    syncService = require('./src/services/syncService');
} catch (e) {
    console.error('无法加载同步服务:', e);
}

try {
    // 尝试加载WebSocket管理器
    webSocketManager = require('./src/services/socketService').webSocketManager;
} catch (e) {
    console.error('无法加载WebSocket管理器:', e);
}

try {
    // 尝试加载Socket服务
    socketService = require('./src/services/socket');
} catch (e) {
    console.error('无法加载Socket服务:', e);
}

export default function App() {
    // 初始化服务
    useEffect(() => {
        try {
            // 初始化加密服务
            if (encryptionService && encryptionService.initEncryptionService) {
                encryptionService.initEncryptionService(encryptionService.EncryptionMode.AES)
                    .catch((error: any) => {
                        console.error('初始化加密服务失败:', error);
                    });
            }

            // 初始化同步管理器
            if (syncManager && syncManager.initSyncManager) {
                syncManager.initSyncManager();
            }

            // 初始化同步服务
            if (syncService && syncService.initSyncService) {
                syncService.initSyncService();
            }

            // 初始化WebSocket管理器
            if (webSocketManager && webSocketManager.initialize) {
                console.log('初始化WebSocket管理器');
                webSocketManager.initialize()
                    .catch((error: any) => {
                        console.error('初始化WebSocket管理器失败:', error);
                    });
            }
        } catch (error) {
            console.error('初始化服务时出错:', error);
        }

        return () => {
            // 清理连接
            if (webSocketManager && webSocketManager.close) {
                webSocketManager.close();
            }
            if (socketService && socketService.disconnectSocket) {
                socketService.disconnectSocket();
            }
        };
    }, []);

    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ConnectionStatusIndicator />
                <NotificationBanner />
                <SyncStatus />
            </GestureHandlerRootView>
        </AuthProvider>
    );
} 