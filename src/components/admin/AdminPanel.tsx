import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AuthGuard from '../auth/AuthGuard';
import { Permission, UserStatus, UserRole } from '../../types/auth';
import { Tabs } from './AdminTabs';
import { Settings, Users, Activity, BarChart3, Key, Shield, Clock } from 'lucide-react-native';

// 颜色常量
const COLORS = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#8E8E93',
    lightGray: '#E5E5E5',
    text: '#333333',
    textLight: '#8A8A8E',
    background: '#F2F2F7',
    card: '#FFFFFF',
    border: '#E5E5E5',
};

// 模拟客服数据
const MOCK_AGENTS = [
    { id: 'agent_1', username: 'agent_sarah', displayName: 'Sarah Johnson', role: UserRole.AGENT, status: UserStatus.ACTIVE },
    { id: 'agent_2', username: 'agent_mike', displayName: 'Mike Chen', role: UserRole.AGENT, status: UserStatus.ACTIVE },
    { id: 'agent_3', username: 'super_lisa', displayName: 'Lisa Wang', role: UserRole.SUPERVISOR, status: UserStatus.ACTIVE },
    { id: 'trainee_1', username: 'trainee_alex', displayName: 'Alex Kim', role: UserRole.TRAINEE, status: UserStatus.ACTIVE },
    { id: 'agent_4', username: 'agent_david', displayName: 'David Miller', role: UserRole.AGENT, status: UserStatus.INACTIVE },
];

// 系统设置选项
interface SystemSetting {
    key: string;
    name: string;
    description: string;
    type: 'toggle' | 'number' | 'text';
    value: any;
    category: 'general' | 'security' | 'notifications' | 'chat' | 'performance';
}

// 模拟系统设置
const MOCK_SETTINGS: SystemSetting[] = [
    {
        key: 'max_agents',
        name: '最大客服数量',
        description: '允许同时在线的客服最大数量',
        type: 'number',
        value: 30,
        category: 'general'
    },
    {
        key: 'enable_notifications',
        name: '启用通知',
        description: '启用系统通知功能',
        type: 'toggle',
        value: true,
        category: 'notifications'
    },
    {
        key: 'auto_assign',
        name: '自动分配会话',
        description: '自动将新会话分配给空闲客服',
        type: 'toggle',
        value: true,
        category: 'chat'
    },
    {
        key: 'session_timeout',
        name: '会话超时时间',
        description: '客户多长时间不活动后会话自动标记为结束（分钟）',
        type: 'number',
        value: 30,
        category: 'chat'
    },
    {
        key: 'api_key_rotation',
        name: 'API密钥轮换周期',
        description: 'API密钥自动轮换的天数',
        type: 'number',
        value: 30,
        category: 'security'
    },
    {
        key: 'working_hours_start',
        name: '工作时间开始',
        description: '工作时间开始时间 (24小时制)',
        type: 'text',
        value: '09:00',
        category: 'general'
    },
    {
        key: 'working_hours_end',
        name: '工作时间结束',
        description: '工作时间结束时间 (24小时制)',
        type: 'text',
        value: '18:00',
        category: 'general'
    },
];

/**
 * 管理员面板组件
 */
const AdminPanel: React.FC = () => {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState<string>('agents');
    const [agents, setAgents] = useState(MOCK_AGENTS);
    const [settings, setSettings] = useState(MOCK_SETTINGS);
    const [settingsFilter, setSettingsFilter] = useState<string>('all');

    // 处理设置变更
    const handleSettingChange = (key: string, value: any) => {
        setSettings(prevSettings =>
            prevSettings.map(setting =>
                setting.key === key ? { ...setting, value } : setting
            )
        );
    };

    // 根据分类筛选设置
    const filteredSettings = settingsFilter === 'all'
        ? settings
        : settings.filter(setting => setting.category === settingsFilter);

    // 保存设置
    const saveSettings = () => {
        // 在实际应用中，这里会调用API保存设置
        Alert.alert('成功', '设置已保存');
    };

    // 更改客服状态
    const toggleAgentStatus = (agentId: string) => {
        setAgents(prevAgents =>
            prevAgents.map(agent =>
                agent.id === agentId
                    ? {
                        ...agent,
                        status: agent.status === UserStatus.ACTIVE
                            ? UserStatus.INACTIVE
                            : UserStatus.ACTIVE
                    }
                    : agent
            )
        );
    };

    return (
        <AuthGuard requireAdmin={true}>
            <View style={styles.container}>
                <Text style={styles.title}>管理员控制台</Text>

                <Tabs
                    tabs={[
                        { key: 'agents', title: '客服管理', icon: Users },
                        { key: 'settings', title: '系统设置', icon: Settings },
                        { key: 'analytics', title: '数据分析', icon: BarChart3 },
                        { key: 'security', title: '安全管理', icon: Shield },
                    ]}
                    activeTab={activeTab}
                    onChangeTab={setActiveTab}
                />

                <ScrollView style={styles.content}>
                    {activeTab === 'agents' && (
                        <View>
                            <Text style={styles.sectionTitle}>客服列表</Text>
                            {agents.map(agent => (
                                <View key={agent.id} style={styles.agentCard}>
                                    <View style={styles.agentInfo}>
                                        <Text style={styles.agentName}>{agent.displayName}</Text>
                                        <Text style={styles.agentUsername}>@{agent.username}</Text>
                                        <View style={styles.badgeContainer}>
                                            <View style={[styles.badge, getRoleBadgeStyle(agent.role)]}>
                                                <Text style={styles.badgeText}>{getRoleLabel(agent.role)}</Text>
                                            </View>
                                            <View style={[styles.badge, getStatusBadgeStyle(agent.status)]}>
                                                <Text style={styles.badgeText}>{getStatusLabel(agent.status)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.agentActions}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, { backgroundColor: agent.status === UserStatus.ACTIVE ? COLORS.danger : COLORS.success }]}
                                            onPress={() => toggleAgentStatus(agent.id)}
                                        >
                                            <Text style={styles.actionButtonText}>
                                                {agent.status === UserStatus.ACTIVE ? '停用' : '启用'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionButton}>
                                            <Text style={styles.actionButtonText}>编辑</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.addButtonText}>+ 添加客服</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {activeTab === 'settings' && (
                        <View>
                            <Text style={styles.sectionTitle}>系统设置</Text>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                                <TouchableOpacity
                                    style={[styles.filterButton, settingsFilter === 'all' && styles.activeFilter]}
                                    onPress={() => setSettingsFilter('all')}
                                >
                                    <Text style={[styles.filterText, settingsFilter === 'all' && styles.activeFilterText]}>全部</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterButton, settingsFilter === 'general' && styles.activeFilter]}
                                    onPress={() => setSettingsFilter('general')}
                                >
                                    <Text style={[styles.filterText, settingsFilter === 'general' && styles.activeFilterText]}>常规</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterButton, settingsFilter === 'security' && styles.activeFilter]}
                                    onPress={() => setSettingsFilter('security')}
                                >
                                    <Text style={[styles.filterText, settingsFilter === 'security' && styles.activeFilterText]}>安全</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterButton, settingsFilter === 'notifications' && styles.activeFilter]}
                                    onPress={() => setSettingsFilter('notifications')}
                                >
                                    <Text style={[styles.filterText, settingsFilter === 'notifications' && styles.activeFilterText]}>通知</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterButton, settingsFilter === 'chat' && styles.activeFilter]}
                                    onPress={() => setSettingsFilter('chat')}
                                >
                                    <Text style={[styles.filterText, settingsFilter === 'chat' && styles.activeFilterText]}>聊天</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            {filteredSettings.map(setting => (
                                <View key={setting.key} style={styles.settingCard}>
                                    <View style={styles.settingHeader}>
                                        <Text style={styles.settingName}>{setting.name}</Text>
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryText}>{getCategoryLabel(setting.category)}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.settingDescription}>{setting.description}</Text>
                                    <View style={styles.settingInput}>
                                        {setting.type === 'toggle' && (
                                            <Switch
                                                value={setting.value}
                                                onValueChange={(value) => handleSettingChange(setting.key, value)}
                                                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                                                thumbColor={setting.value ? COLORS.white : COLORS.gray}
                                            />
                                        )}
                                        {setting.type === 'number' && (
                                            <TextInput
                                                style={styles.textInput}
                                                value={setting.value.toString()}
                                                onChangeText={(text) => handleSettingChange(setting.key, parseInt(text) || 0)}
                                                keyboardType="numeric"
                                            />
                                        )}
                                        {setting.type === 'text' && (
                                            <TextInput
                                                style={styles.textInput}
                                                value={setting.value}
                                                onChangeText={(text) => handleSettingChange(setting.key, text)}
                                            />
                                        )}
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
                                <Text style={styles.saveButtonText}>保存设置</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {activeTab === 'analytics' && (
                        <View style={styles.comingSoon}>
                            <BarChart3 size={60} color={COLORS.primary} />
                            <Text style={styles.comingSoonText}>数据分析功能开发中</Text>
                        </View>
                    )}

                    {activeTab === 'security' && (
                        <View style={styles.comingSoon}>
                            <Shield size={60} color={COLORS.primary} />
                            <Text style={styles.comingSoonText}>安全管理功能开发中</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </AuthGuard>
    );
};

// 获取角色标签
function getRoleLabel(role: UserRole): string {
    switch (role) {
        case UserRole.ADMIN: return '管理员';
        case UserRole.SUPERVISOR: return '主管';
        case UserRole.AGENT: return '客服';
        case UserRole.TRAINEE: return '培训中';
        default: return '未知';
    }
}

// 获取状态标签
function getStatusLabel(status: UserStatus): string {
    switch (status) {
        case UserStatus.ACTIVE: return '活跃';
        case UserStatus.INACTIVE: return '非活跃';
        case UserStatus.SUSPENDED: return '已暂停';
        case UserStatus.PENDING: return '待审批';
        default: return '未知';
    }
}

// 获取角色徽章样式
function getRoleBadgeStyle(role: UserRole): any {
    switch (role) {
        case UserRole.ADMIN: return { backgroundColor: COLORS.primary };
        case UserRole.SUPERVISOR: return { backgroundColor: COLORS.info };
        case UserRole.AGENT: return { backgroundColor: COLORS.success };
        case UserRole.TRAINEE: return { backgroundColor: COLORS.warning };
        default: return {};
    }
}

// 获取状态徽章样式
function getStatusBadgeStyle(status: UserStatus): any {
    switch (status) {
        case UserStatus.ACTIVE: return { backgroundColor: COLORS.success };
        case UserStatus.INACTIVE: return { backgroundColor: COLORS.gray };
        case UserStatus.SUSPENDED: return { backgroundColor: COLORS.danger };
        case UserStatus.PENDING: return { backgroundColor: COLORS.warning };
        default: return {};
    }
}

// 获取设置分类标签
function getCategoryLabel(category: string): string {
    switch (category) {
        case 'general': return '常规';
        case 'security': return '安全';
        case 'notifications': return '通知';
        case 'chat': return '聊天';
        case 'performance': return '性能';
        default: return '其他';
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 16,
        color: COLORS.text,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: COLORS.text,
    },
    agentCard: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    agentInfo: {
        flex: 1,
    },
    agentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    agentUsername: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    badgeContainer: {
        flexDirection: 'row',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    agentActions: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        marginLeft: 8,
        backgroundColor: COLORS.primary,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: COLORS.success,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingCard: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    settingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    settingName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    categoryBadge: {
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryText: {
        color: COLORS.text,
        fontSize: 12,
    },
    settingDescription: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 16,
    },
    settingInput: {
        alignItems: 'flex-end',
    },
    textInput: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 4,
        padding: 8,
        width: '50%',
        textAlign: 'right',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterScroll: {
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.lightGray,
        marginRight: 8,
    },
    activeFilter: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    activeFilterText: {
        color: COLORS.white,
    },
    comingSoon: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
    },
    comingSoonText: {
        marginTop: 16,
        fontSize: 18,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});

export default AdminPanel; 