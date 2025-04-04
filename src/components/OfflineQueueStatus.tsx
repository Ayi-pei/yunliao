import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react-native';
import { OfflineQueueManager } from '../services/offlineQueue';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface OfflineQueueStatusProps {
    queueManager: OfflineQueueManager;
    onManualSync?: () => Promise<void>;
    expanded?: boolean;
    onToggleExpand?: () => void;
}

/**
 * 离线队列状态组件
 * 显示队列中的消息数量、上次同步时间等信息
 */
const OfflineQueueStatus: React.FC<OfflineQueueStatusProps> = ({
    queueManager,
    onManualSync,
    expanded = false,
    onToggleExpand
}) => {
    const [queueSize, setQueueSize] = useState<number>(0);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
    const [syncError, setSyncError] = useState<string | null>(null);

    useEffect(() => {
        // 监听队列大小变化
        const queueListener = (size: number) => {
            setQueueSize(size);
        };

        // 监听同步状态变化
        const syncListener = (success: boolean, error?: Error) => {
            setSyncing(false);
            if (!success && error) {
                setSyncError(error.message);
            } else {
                setSyncError(null);
                updateLastSyncTime();
            }
        };

        // 注册监听器
        queueManager.registerQueueChangedListener(queueListener);
        queueManager.registerSyncListener(syncListener);

        // 获取初始状态
        updateLastSyncTime();

        // 清理函数
        return () => {
            queueManager.unregisterQueueChangedListener(queueListener);
            queueManager.unregisterSyncListener(syncListener);
        };
    }, [queueManager]);

    // 更新上次同步时间
    const updateLastSyncTime = async () => {
        const time = await queueManager.getLastSyncTime();
        setLastSyncTime(time);
    };

    // 手动同步
    const handleManualSync = async () => {
        if (syncing || queueSize === 0) return;

        setSyncing(true);
        setSyncError(null);

        try {
            if (onManualSync) {
                await onManualSync();
            }
        } catch (error) {
            console.error('手动同步失败:', error);
            setSyncError((error as Error).message);
            setSyncing(false);
        }
    };

    // 格式化上次同步时间
    const getFormattedLastSyncTime = () => {
        if (!lastSyncTime) return '从未同步';

        return formatDistance(new Date(lastSyncTime), new Date(), {
            addSuffix: true,
            locale: zhCN
        });
    };

    // 如果队列为空且无错误，不显示任何内容
    if (queueSize === 0 && !syncError) {
        return null;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={onToggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    {queueSize > 0 ? (
                        <CloudOff width={18} height={18} color="#FF6B6B" />
                    ) : (
                        <Cloud width={18} height={18} color="#4CAF50" />
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>
                        {queueSize > 0
                            ? `${queueSize} 条消息等待同步`
                            : '所有消息已同步'}
                    </Text>
                    <Text style={styles.subtitle}>
                        上次同步: {getFormattedLastSyncTime()}
                    </Text>
                </View>

                {queueSize > 0 && (
                    <TouchableOpacity
                        style={styles.syncButton}
                        onPress={handleManualSync}
                        disabled={syncing}
                    >
                        {syncing ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <RefreshCw width={16} height={16} color="#fff" />
                        )}
                    </TouchableOpacity>
                )}
            </TouchableOpacity>

            {expanded && syncError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>同步错误: {syncError}</Text>
                </View>
            )}

            {expanded && queueSize > 0 && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailText}>
                        队列中的消息将在网络连接恢复后自动同步。您也可以点击同步按钮手动触发同步。
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 16,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f3f4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    syncButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#FFCDD2',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 13,
    },
    detailsContainer: {
        padding: 12,
        backgroundColor: '#FAFAFA',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    detailText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});

export default OfflineQueueStatus; 