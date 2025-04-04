import PermissionBasedNavigation, { NavigationItem } from '@/src/components/navigation/PermissionBasedNavigation';
import { COLORS } from '@/src/constants';
import { Screens } from '@/src/constants/screens';
import { useAuth } from '@/src/contexts/AuthContext';
import { Permission } from '@/src/types/auth';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Home, LogOut, MessageSquare, Settings, Shield, Users } from 'lucide-react-native';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 定义导航项
const navigationItems: NavigationItem[] = [
    {
        key: 'home',
        title: '主页',
        icon: <Home size={20} color={COLORS.primary} />,
        path: Screens.HOME,
    },
    {
        key: 'chat',
        title: '会话',
        icon: <MessageSquare size={20} color={COLORS.primary} />,
        path: Screens.CHAT_LIST,
        requiredPermissions: [Permission.SEND_MESSAGES],
    },
    {
        key: 'customers',
        title: '客户管理',
        icon: <Users size={20} color={COLORS.primary} />,
        path: Screens.CUSTOMERS,
        requiredPermissions: [Permission.VIEW_ANALYTICS],
        hideIfNoPermission: true,
    },
    {
        key: 'admin',
        title: '管理控制台',
        icon: <Shield size={20} color={COLORS.primary} />,
        path: Screens.ADMIN,
        requiredPermissions: [Permission.MANAGE_AGENTS],
        hideIfNoPermission: true,
    },
    {
        key: 'settings',
        title: '设置',
        icon: <Settings size={20} color={COLORS.primary} />,
        path: Screens.SETTINGS,
    },
];

function CustomDrawerContent(props: any) {
    const insets = useSafeAreaInsets();
    const { agent, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace(Screens.LOGIN);
        } catch (error) {
            console.error('退出登录失败:', error);
            try {
                router.replace('/');
            } catch (navError) {
                console.error('导航失败:', navError);
                alert('退出登录失败，请重试');
            }
        }
    };

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={[
                styles.drawerContent,
                { paddingTop: insets.top + 10 }
            ]}
        >
            <View style={styles.userInfoSection}>
                <View style={styles.userInfo}>
                    <Image
                        source={
                            agent?.avatar
                                ? { uri: agent.avatar }
                                : { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA4LTEwVDEyOjA5OjIzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wMy0wOVQxNTo0NDoyMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wMy0wOVQxNTo0NDoyMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYTM4NGM2MS0yZTc3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' }
                        }
                        style={styles.avatar}
                    />
                    <View style={styles.userText}>
                        <Text style={styles.userName}>{agent?.displayName || 'Customer Service'}</Text>
                        <Text style={styles.userStatus}>{agent?.status || 'Online'}</Text>
                    </View>
                </View>
            </View>

            {/* 使用基于权限的导航组件替换手动导航项 */}
            <View style={styles.drawerSection}>
                <PermissionBasedNavigation
                    items={navigationItems}
                    onNavigate={handleNavigate}
                    activePath={props.state?.routes[props.state.index]?.name || '/'}
                    orientation="vertical"
                    showLabels={true}
                    itemStyle={styles.drawerItem}
                />
            </View>

            <View style={styles.drawerFooter}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>退出登录</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

export default function DrawerLayout() {
    return (
        <Drawer
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.white,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                },
                headerTintColor: COLORS.text,
                headerTitleStyle: {
                    fontFamily: 'Inter_600SemiBold',
                },
                drawerStyle: {
                    width: Platform.OS === 'web' ? 280 : '75%',
                    backgroundColor: COLORS.white,
                },
                headerShown: true,
                drawerLabelStyle: { marginLeft: -20 },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        />
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.separator,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    userText: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.text,
        marginBottom: 4,
    },
    userStatus: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: COLORS.gray,
    },
    drawerSection: {
        flex: 1,
        marginTop: 15,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 4,
    },
    drawerItemText: {
        fontSize: 15,
        fontFamily: 'Inter_500Medium',
        marginLeft: 20,
        color: COLORS.textSecondary,
    },
    drawerFooter: {
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: COLORS.separator,
        marginTop: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 15,
        paddingHorizontal: 16,
    },
    logoutText: {
        marginLeft: 20,
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: COLORS.danger,
    },
});