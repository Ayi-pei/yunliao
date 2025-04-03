import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
// @ts-ignore
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { AgentConsole } from '@/src/components/agent';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ConsoleScreen() {
    const router = useRouter();
    const { agent } = useAuth();

    // 检查权限 - 临时设置为true，使所有用户都能访问（仅测试用）
    const canAccessConsole = true; // 临时修改，正式环境应该使用: agent?.permissions?.includes('chat') || false;

    if (!canAccessConsole) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={24} color="#007AFF" />
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
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
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
        color: '#8E8E93',
        textAlign: 'center',
    },
    backHomeButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    backHomeText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
}); 