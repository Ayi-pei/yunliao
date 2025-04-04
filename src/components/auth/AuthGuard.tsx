import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Permission } from '../../types/auth';
import { COLORS } from '../../constants';

interface AuthGuardProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  fallback?: ReactNode;
  requireAdmin?: boolean;
  requireSupervisor?: boolean;
}

/**
 * 认证守卫组件
 * 用于保护需要认证的组件
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredPermissions = [],
  fallback,
  requireAdmin = false,
  requireSupervisor = false
}) => {
  const { isLoading, isAuthenticated, user, hasPermission, isAdmin, isSupervisor } = useAuth();

  // 如果正在加载认证状态，显示加载指示器
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>正在加载...</Text>
      </View>
    );
  }

  // 如果未认证，显示fallback或默认未认证提示
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.text}>请先登录</Text>
      </View>
    );
  }

  // 检查是否需要管理员权限
  if (requireAdmin && !isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>需要管理员权限</Text>
      </View>
    );
  }

  // 检查是否需要主管权限
  if (requireSupervisor && !isSupervisor) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>需要主管权限</Text>
      </View>
    );
  }

  // 检查是否有所需的所有权限
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission =>
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>权限不足</Text>
        </View>
      );
    }
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default AuthGuard; 