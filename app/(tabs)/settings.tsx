import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text, Platform, Switch } from 'react-native';
import { router } from 'expo-router';
import { SettingGroup, SettingItem } from '@/src/components/settings';
import { Share, LogOut, Bell, Moon, User, Shield, HelpCircle, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApp } from '@/src/contexts/AppContext';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '@/src/constants';

// 定义设置项类型
interface SettingItemType {
  icon: React.ReactNode;
  label: string;
  value?: string;
  customRight?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  textStyle?: object;
  type?: 'navigate' | 'toggle' | 'default';
}

export default function Settings() {
  const { theme, setTheme, notificationsEnabled, setNotificationsEnabled } = useTheme();
  const { agent, logout } = useAuth();
  const { customers } = useApp();

  // 管理员权限检查
  const isAdmin = agent?.permissions.includes('manage_agents') || false;

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账号吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  const copyCustomerId = useCallback(async () => {
    if (agent?.id) {
      await Clipboard.setStringAsync(agent.id);
      Alert.alert('复制成功', `已复制客服ID: ${agent.id}`);
    }
  }, [agent?.id]);

  const settingsGroups = [
    // 个人信息组
    {
      title: '账户',
      items: [
        {
          icon: <User size={22} color={COLORS.primary} />,
          label: '客服ID',
          value: agent?.id || '',
          onPress: copyCustomerId,
          showArrow: false,
        },
      ],
    },
    // 应用设置组
    {
      title: '应用设置',
      items: [
        {
          icon: <Moon size={22} color={COLORS.primary} />,
          label: '暗黑模式',
          customRight: (
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: COLORS.gray5, true: COLORS.primary }}
              thumbColor={Platform.OS === 'android' ? COLORS.white : ''}
            />
          ),
          showArrow: false,
        },
        {
          icon: <Bell size={22} color={COLORS.primary} />,
          label: '通知',
          customRight: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.gray5, true: COLORS.primary }}
              thumbColor={Platform.OS === 'android' ? COLORS.white : ''}
            />
          ),
          showArrow: false,
        },
      ],
    },
    // 管理功能组
    ...(isAdmin ? [
      {
        title: '管理',
        items: [
          {
            icon: <Shield size={22} color={COLORS.primary} />,
            label: '管理控制台',
            onPress: () => {
              if (isAdmin) {
                router.push('../admin');
              } else {
                Alert.alert('权限不足', '您没有访问管理控制台的权限');
              }
            },
            type: 'navigate' as const,
          },
          {
            icon: <MessageSquare size={22} color={COLORS.primary} />,
            label: '客服控制台',
            onPress: () => {
              router.push('../admin/console');
            },
            type: 'navigate' as const,
          },
        ],
      },
    ] : []),
    // 其他功能组
    {
      title: '其他',
      items: [
        {
          icon: <Share size={22} color={COLORS.primary} />,
          label: '邀请同事',
          onPress: () => {
            /* 实现邀请功能 */
          },
        },
        {
          icon: <HelpCircle size={22} color={COLORS.primary} />,
          label: '帮助与反馈',
          onPress: () => {
            /* 实现帮助功能 */
          },
        },
        {
          icon: <LogOut size={22} color={COLORS.danger} />,
          label: '退出登录',
          onPress: handleLogout,
          textStyle: { color: COLORS.danger },
          showArrow: false,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>设置</Text>
          <Text style={styles.subtitle}>
            {agent?.name || '客服'} | 当前用户数: {customers.length}
          </Text>
        </View>

        {settingsGroups.map((group, groupIndex) => (
          <SettingGroup key={groupIndex} title={group.title}>
            {group.items.map((item, itemIndex) => {
              // 转换为SettingItemType类型，确保所有属性都是可选的
              const settingItem = item as unknown as SettingItemType;
              return (
                <SettingItem
                  key={itemIndex}
                  icon={settingItem.icon}
                  label={settingItem.label}
                  value={settingItem.value}
                  customRight={settingItem.customRight}
                  onPress={settingItem.onPress}
                  showArrow={settingItem.showArrow !== false}
                  textStyle={settingItem.textStyle}
                  type={settingItem.type}
                />
              );
            })}
          </SettingGroup>
        ))}

        <View style={styles.version}>
          <Text style={styles.versionText}>版本: 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  version: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.gray,
  },
});