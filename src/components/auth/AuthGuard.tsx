import React, { ReactNode, useEffect } from 'react';
// @ts-ignore
import { useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 身份验证守卫组件
 * 根据用户认证状态重定向到适当的页面
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 如果认证加载中，不执行任何操作
    if (isLoading) return;

    // 获取当前路径的第一个段，判断是否在认证路由内
    const inAuthGroup = segments[0] === '(auth)';

    // 根据认证状态和当前路径决定重定向
    if (!isAuthenticated && !inAuthGroup) {
      // 用户未认证且不在认证路由内，重定向到登录页面
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // 用户已认证但在认证路由内，重定向到主页
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // 如果认证状态正在加载，显示加载指示器
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 渲染子组件
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
});

export default AuthGuard; 