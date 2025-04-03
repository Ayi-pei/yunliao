// @ts-ignore
import { Tabs } from 'expo-router';
import { MessageSquare, Users, Settings } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import TouchableView from '@/src/components/common/TouchableView';

export default function TabLayout() {
  const styles = StyleSheet.create({
    tabBarIcon: {
      pointerEvents: 'none',
    },
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          backgroundColor: '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Inter_600SemiBold',
        },
      }}>
      <Tabs.Screen
        name="chat"
        options={{
          title: '会话',
          headerTitle: '当前会话',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TouchableView style={styles.tabBarIcon}>
              <MessageSquare size={size} color={color} />
            </TouchableView>
          ),
        }}
      />
      <Tabs.Screen
        name="agents"
        options={{
          title: '客服',
          headerTitle: '客服人员',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TouchableView style={styles.tabBarIcon}>
              <Users size={size} color={color} />
            </TouchableView>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          headerTitle: '系统设置',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TouchableView style={styles.tabBarIcon}>
              <Settings size={size} color={color} />
            </TouchableView>
          ),
        }}
      />
    </Tabs>
  );
}