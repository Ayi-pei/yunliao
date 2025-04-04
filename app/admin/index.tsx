import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/contexts/AuthContext';
import { Permission } from '@/src/types/auth';
import { Stack, useRouter } from 'expo-router';
import { BarChart, ChevronRight, MessageSquare, Settings, Shield, User, Users } from 'lucide-react-native';

export default function AdminScreen() {
    const router = useRouter();
    const { agent } = useAuth();

    // 管理员权限检查
    const hasAdminAccess = agent?.permissions.includes(Permission.MANAGE_AGENTS) ||
        agent?.permissions.includes(Permission.MANAGE_SYSTEM);

    // 如果没有管理员权限
    if (!hasAdminAccess) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: '管理控制台', headerShown: true }} />
                <View style={styles.noAccess}>
                    <Shield size={60} color={COLORS.gray} />
                    <Text style={styles.noAccessTitle}>权限不足</Text>
                    <Text style={styles.noAccessText}>您没有访问管理控制台的权限</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>返回</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 管理菜单功能项
    const adminMenuItems = [
        {
            id: 'team',
            title: '团队管理',
            description: '管理客服团队和权限',
            icon: Users,
            color: COLORS.primary,
            route: '/(tabs)/team',
            permission: Permission.MANAGE_AGENTS
        },
        {
            id: 'console',
            title: '客服控制台',
            description: '查看并管理实时会话',
            icon: MessageSquare,
            color: COLORS.success,
            route: '/admin/console',
            permission: Permission.SEND_MESSAGES
        },
        {
            id: 'system',
            title: '系统设置',
            description: '配置系统参数和集成',
            icon: Settings,
            color: COLORS.warning,
            route: '/admin/system',
            permission: Permission.MANAGE_SYSTEM
        },
        {
            id: 'analytics',
            title: '数据分析',
            description: '查看会话统计和性能报告',
            icon: BarChart,
            color: COLORS.info,
            route: '/admin/analytics',
            permission: Permission.VIEW_ANALYTICS
        }
    ];

    // 过滤出有权限访问的菜单项
    const authorizedMenuItems = adminMenuItems.filter(item =>
        !item.permission || agent?.permissions.includes(item.permission)
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: '管理控制台', headerShown: true }} />

            <ScrollView style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        {agent?.avatar ? (
                            // 显示用户头像
                            <Text>头像</Text>
                        ) : (
                            <User size={28} color={COLORS.white} />
                        )}
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{agent?.displayName || '管理员'}</Text>
                        <Text style={styles.profileRole}>
                            {agent?.permissions.includes(Permission.MANAGE_SYSTEM) ? '系统管理员' : '团队管理员'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>管理功能</Text>

                <View style={styles.menuContainer}>
                    {authorizedMenuItems.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => router.push(item.route)}
                        >
                            <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                                <item.icon size={22} color={COLORS.white} />
                            </View>

                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuDescription}>{item.description}</Text>
                            </View>

                            <ChevronRight size={20} color={COLORS.gray} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>快捷操作</Text>

                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/(tabs)/settings')}
                    >
                        <View style={[styles.menuIconContainer, { backgroundColor: COLORS.secondary }]}>
                            <Settings size={22} color={COLORS.white} />
                        </View>

                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>个人设置</Text>
                            <Text style={styles.menuDescription}>管理您的账户和偏好设置</Text>
                        </View>

                        <ChevronRight size={20} color={COLORS.gray} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    noAccess: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noAccessTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
        color: '#000000',
    },
    noAccessText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    backButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 16,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flexDirection: 'column',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 14,
        color: '#8E8E93',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#000000',
    },
    menuContainer: {
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuTextContainer: {
        flexDirection: 'column',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 14,
        color: '#8E8E93',
    },
}); 