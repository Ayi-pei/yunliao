import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Sliders, Users, Key, MessageSquare, BarChart3, Calendar, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApp } from '@/src/contexts/AppContext';
import { AUTH_CONFIG } from '@/src/services/config';
import { validateKey } from '@/src/types';

// 定义统计卡片组件
interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}

const StatCard = ({ title, value, icon, color, loading = false }: StatCardProps) => (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        {loading ? (
            <ActivityIndicator size="small" color={color} />
        ) : (
            <>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                        {icon}
                    </View>
                </View>
                <Text style={[styles.cardValue, { color }]}>{value}</Text>
            </>
        )}
    </View>
);

export default function AdminConsoleScreen() {
    const router = useRouter();
    const { agent } = useAuth();
    const { sessions, customers, messages } = useApp();

    // 检查管理员权限
    const isAdmin = agent?.permissions.includes('manage_agents') || false;

    // 页面状态
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    // 密钥管理状态
    const [apiKey, setApiKey] = useState('');
    const [validKey, setValidKey] = useState(false);
    const [showGeneratedKey, setShowGeneratedKey] = useState(false);
    const [generatedKey, setGeneratedKey] = useState('');

    // 获取当前统计数据
    const stats = {
        totalCustomers: customers.length,
        totalAgents: 3, // 模拟数据
        activeSessions: sessions.filter(s => s.status === 'active').length,
        totalMessages: Object.values(messages).reduce((total, msgs) => total + msgs.length, 0),
        todayMessages: Object.values(messages).reduce((total, msgs) => {
            const today = new Date().toDateString();
            return total + msgs.filter(m => new Date(m.timestamp).toDateString() === today).length;
        }, 0),
        resolvedSessions: sessions.filter(s => s.status === 'resolved').length,
    };

    // 模拟加载数据
    useEffect(() => {
        if (!isAdmin) {
            Alert.alert('权限不足', '您没有访问管理控制台的权限', [
                { text: '返回', onPress: () => router.back() }
            ]);
            return;
        }

        // 模拟加载延迟
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isAdmin, router]);

    // 验证API密钥
    const handleValidateKey = () => {
        if (!apiKey.trim()) {
            Alert.alert('错误', '请输入API密钥');
            return;
        }

        const isValid = validateKey(apiKey);
        setValidKey(isValid);

        if (isValid) {
            Alert.alert('验证成功', '此API密钥有效');
        } else {
            Alert.alert('验证失败', '此API密钥无效');
        }
    };

    // 生成新密钥
    const handleGenerateKey = () => {
        // 生成模拟密钥
        const mockKey = `key_${Math.random().toString(36).substring(2, 15)}`;
        setGeneratedKey(mockKey);
        setShowGeneratedKey(true);
    };

    // 复制密钥
    const handleCopyKey = () => {
        Alert.alert('复制成功', '密钥已复制到剪贴板');
    };

    // 渲染仪表盘
    const renderDashboard = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>系统状态概览</Text>

            <View style={styles.statsGrid}>
                <StatCard
                    title="用户总数"
                    value={stats.totalCustomers}
                    icon={<Users size={20} color="#007AFF" />}
                    color="#007AFF"
                    loading={loading}
                />

                <StatCard
                    title="客服总数"
                    value={stats.totalAgents}
                    icon={<Users size={20} color="#34C759" />}
                    color="#34C759"
                    loading={loading}
                />

                <StatCard
                    title="活跃会话"
                    value={stats.activeSessions}
                    icon={<MessageSquare size={20} color="#FF9500" />}
                    color="#FF9500"
                    loading={loading}
                />

                <StatCard
                    title="消息总数"
                    value={stats.totalMessages}
                    icon={<MessageSquare size={20} color="#5856D6" />}
                    color="#5856D6"
                    loading={loading}
                />

                <StatCard
                    title="今日消息"
                    value={stats.todayMessages}
                    icon={<Calendar size={20} color="#FF2D55" />}
                    color="#FF2D55"
                    loading={loading}
                />

                <StatCard
                    title="已解决会话"
                    value={stats.resolvedSessions}
                    icon={<BarChart3 size={20} color="#00C7BE" />}
                    color="#00C7BE"
                    loading={loading}
                />
            </View>

            <Text style={styles.sectionTitle}>最近活动</Text>

            <View style={styles.card}>
                <Text style={styles.emptyText}>即将推出功能: 实时活动日志</Text>
            </View>
        </View>
    );

    // 渲染密钥管理
    const renderKeyManagement = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>API密钥管理</Text>

            <View style={styles.card}>
                <Text style={styles.cardSubtitle}>验证密钥</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="输入API密钥"
                        value={apiKey}
                        onChangeText={setApiKey}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleValidateKey}
                    >
                        <Text style={styles.buttonText}>验证</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardSubtitle}>生成新密钥</Text>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleGenerateKey}
                >
                    <Key size={16} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>生成密钥</Text>
                </TouchableOpacity>

                {showGeneratedKey && (
                    <View style={styles.generatedKeyContainer}>
                        <Text style={styles.generatedKeyLabel}>新生成的密钥:</Text>
                        <View style={styles.generatedKey}>
                            <Text style={styles.generatedKeyText}>{generatedKey}</Text>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={handleCopyKey}
                            >
                                <Text style={styles.copyButtonText}>复制</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.warningText}>
                            请立即保存此密钥，它不会再次显示！
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardSubtitle}>管理员密钥</Text>
                <Text style={styles.adminKeyInfo}>
                    当前配置的管理员密钥: <Text style={styles.boldText}>{AUTH_CONFIG.ADMIN_API_KEY}</Text>
                </Text>
                <Text style={styles.noteText}>
                    注意: 管理员密钥用于管理员权限访问。可通过.env文件的ADMIN_API_KEY变量修改。
                </Text>
            </View>
        </View>
    );

    // 渲染系统设置
    const renderSystemSettings = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>系统设置</Text>

            <View style={styles.card}>
                <Text style={styles.emptyText}>即将推出功能: 系统参数配置界面</Text>
            </View>
        </View>
    );

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text>权限检查中...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* 标签栏 */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
                        onPress={() => setActiveTab('dashboard')}
                    >
                        <BarChart3
                            size={18}
                            color={activeTab === 'dashboard' ? '#007AFF' : '#8E8E93'}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'dashboard' && styles.activeTabText
                            ]}
                        >
                            仪表盘
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'keys' && styles.activeTab]}
                        onPress={() => setActiveTab('keys')}
                    >
                        <Key
                            size={18}
                            color={activeTab === 'keys' ? '#007AFF' : '#8E8E93'}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'keys' && styles.activeTabText
                            ]}
                        >
                            密钥管理
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
                        onPress={() => setActiveTab('settings')}
                    >
                        <Sliders
                            size={18}
                            color={activeTab === 'settings' ? '#007AFF' : '#8E8E93'}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'settings' && styles.activeTabText
                            ]}
                        >
                            系统设置
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 根据选中的标签显示不同内容 */}
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'keys' && renderKeyManagement()}
                {activeTab === 'settings' && renderSystemSettings()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 10,
    },
    activeTab: {
        backgroundColor: '#E9F0FF',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#8E8E93',
        marginLeft: 6,
    },
    activeTabText: {
        color: '#007AFF',
        fontFamily: 'Inter_600SemiBold',
    },
    tabContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
        marginVertical: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...(Platform.OS === 'web' ? {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        } : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        }),
        elevation: 2,
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#8E8E93',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardValue: {
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
    },
    cardSubtitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#8E8E93',
        textAlign: 'center',
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontFamily: 'Inter_400Regular',
    },
    button: {
        marginLeft: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#000000',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
    },
    primaryButtonText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#FFFFFF',
        marginLeft: 6,
    },
    generatedKeyContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
    },
    generatedKeyLabel: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#000000',
        marginBottom: 8,
    },
    generatedKey: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    generatedKeyText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#000000',
    },
    copyButton: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    copyButtonText: {
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        color: '#FFFFFF',
    },
    warningText: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#FF3B30',
        marginTop: 8,
    },
    adminKeyInfo: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#000000',
        marginBottom: 8,
    },
    boldText: {
        fontFamily: 'Inter_600SemiBold',
    },
    noteText: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#8E8E93',
        fontStyle: 'italic',
    },
}); 