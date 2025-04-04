// @ts-ignore
import { NavigationItem } from '@/src/components/navigation/PermissionBasedNavigation';
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/contexts/AuthContext';
import { Permission } from '@/src/types/auth';
import { Tabs } from 'expo-router';
import { MessageSquare, Settings, User, Users } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

const tabItems: NavigationItem[] = [
  {
    key: 'index',
    title: '对话',
    icon: <MessageSquare size={22} color={COLORS.primary} />,
    path: '/(tabs)/index',
    requiredPermissions: [Permission.SEND_MESSAGES],
  },
  {
    key: 'team',
    title: '客户',
    icon: <Users size={22} color={COLORS.primary} />,
    path: '/(tabs)/team',
    requiredPermissions: [Permission.VIEW_ANALYTICS],
  },
  {
    key: 'agent',
    title: '个人',
    icon: <User size={22} color={COLORS.primary} />,
    path: '/(tabs)/agent',
  },
  {
    key: 'settings',
    title: '设置',
    icon: <Settings size={22} color={COLORS.primary} />,
    path: '/(tabs)/settings',
  },
];

export default function TabLayout() {
  const { agent } = useAuth();

  // 根据权限过滤Tab项
  const getTabItems = () => {
    return tabItems.filter(item => {
      if (!item.requiredPermissions) return true;

      if (!agent) return false;

      return item.requiredPermissions.every(permission =>
        agent.permissions.includes(permission)
      );
    });
  };

  // 获取可见的Tab项
  const visibleTabs = getTabItems();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          ...Platform.select({
            web: {
              boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.05)',
            },
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 5,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
      {visibleTabs.map((tab) => (
        <Tabs.Screen
          key={tab.key}
          name={tab.key}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }: { color: string }) =>
              React.cloneElement(tab.icon as React.ReactElement, { color }),
          }}
        />
      ))}
    </Tabs>
  );
}