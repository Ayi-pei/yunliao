import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import { useAuth } from '@/src/contexts/AuthContext';
import { Permission } from '@/src/types/auth';
import { Stack, useRouter } from 'expo-router';
import { BarChart, Lock, MessageSquare, Users } from 'lucide-react-native';

export default function ConsoleScreen() {
    const router = useRouter();
    // 检查权限 - 用户需要有 console_access 或 chat 权限
    const { agent } = useAuth();
    const hasAccess = agent?.permissions.includes(Permission.SEND_MESSAGES) ||
        agent?.permissions.includes(Permission.MANAGE_SETTINGS);

    const [activeTab, setActiveTab] = useState('chats');

    // 如果没有权限访问
    if (!hasAccess) {
        return (
            <View style={styles.accessDenied}>
                <Lock size={48} color="#999" />
                <Text style={styles.accessDeniedText}>您没有访问权限</Text>
                <View style={styles.backButton}>
                    <Text style={styles.backButtonText} onPress={() => router.back()}>返回首页</Text>
                </View>
            </View>
        );
    }

    // 选项卡配置
    const tabs = [
        { key: 'chats', title: '聊天会话', icon: MessageSquare },
        { key: 'agents', title: '在线客服', icon: Users },
        { key: 'statistics', title: '统计分析', icon: BarChart },
    ];

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: '客服控制台',
                    headerShown: true,
                }}
            />

            <View style={styles.tabBar}>
                {tabs.map(tab => (
                    <View
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.activeTab
                        ]}
                    >
                        <tab.icon
                            size={20}
                            color={activeTab === tab.key ? '#007AFF' : '#8E8E93'}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab.key && styles.activeTabText
                            ]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            {tab.title}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'chats' && (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>聊天会话</Text>
                        <Text style={styles.placeholderText}>暂无活跃会话</Text>
                    </View>
                )}

                {activeTab === 'agents' && (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>在线客服</Text>
                        <Text style={styles.placeholderText}>暂无在线客服</Text>
                    </View>
                )}

                {activeTab === 'statistics' && (
                    <View style={styles.statsContainer}>
                        <Text style={styles.sectionTitle}>统计分析</Text>

                        <View style={styles.statsRow}>
                            <View style={styles.statsCard}>
                                <Text style={styles.statsTitle}>在线客户</Text>
                                <Text style={styles.statsValue}>0</Text>
                            </View>

                            <View style={styles.statsCard}>
                                <Text style={styles.statsTitle}>待处理会话</Text>
                                <Text style={styles.statsValue}>0</Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statsCard}>
                                <Text style={styles.statsTitle}>活跃会话</Text>
                                <Text style={styles.statsValue}>0</Text>
                            </View>

                            <View style={styles.statsCard}>
                                <Text style={styles.statsTitle}>已解决</Text>
                                <Text style={styles.statsValue}>0</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {activeTab === 'chats' && '共 0 个会话'}
                    {activeTab === 'agents' && '客服管理'}
                    {activeTab === 'statistics' && '统计数据'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 14,
        color: '#8E8E93',
        marginLeft: 4,
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: '500',
    },
    sectionContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    placeholderText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        padding: 20,
    },
    footer: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#ffffff',
    },
    footerText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
    accessDenied: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    accessDeniedText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
        marginVertical: 20,
    },
    backButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    statsContainer: {
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statsCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statsTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    statsValue: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    }
}); 