import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { AgentConsole } from '@/src/components/agent';
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/contexts/AuthContext';
import { Permission } from '@/src/types/auth';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function ConsoleScreen() {
    const router = useRouter();
    const { agent } = useAuth();

    // 检查权限 - 客服需要拥有相关权限才能访问控制台
    const canAccessConsole = agent?.permissions?.includes(Permission.SEND_MESSAGES) ||
        agent?.permissions?.includes(Permission.ASSIGN_CHATS);

    if (!canAccessConsole) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>客服控制台</Text>
                </View>
                <View style={styles.noAccess}>
                    <Text style={styles.noAccessText}>您没有访问客服控制台的权限</Text>
                    <TouchableOpacity
                        style={styles.backHomeButton}
                        onPress={() => router.replace('/(tabs)/')}
                    >
                        <Text style={styles.backHomeText}>返回首页</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: '客服控制台',
                    headerShown: false,
                }}
            />
            <AgentConsole />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.separator,
        backgroundColor: COLORS.white,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    noAccess: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noAccessText: {
        fontSize: 16,
        marginBottom: 20,
        color: COLORS.gray,
        textAlign: 'center',
    },
    backHomeButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    backHomeText: {
        color: COLORS.white,
        fontWeight: '600',
    },
}); 