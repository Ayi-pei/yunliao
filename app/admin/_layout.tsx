import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '@/src/constants';

export default function AdminLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: COLORS.white,
                },
                headerTitleStyle: {
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 18,
                    color: COLORS.text,
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: '管理控制台',
                }}
            />
            <Stack.Screen
                name="console"
                options={{
                    title: '客服控制台',
                }}
            />
            <Stack.Screen
                name="blacklist"
                options={{
                    title: '黑名单管理',
                }}
            />
            <Stack.Screen
                name="share-links"
                options={{
                    title: '分享链接管理',
                }}
            />
        </Stack>
    );
} 