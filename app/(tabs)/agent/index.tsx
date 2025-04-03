import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
// @ts-ignore
import { useRouter } from 'expo-router';
import { User, LogOut, Bell, Settings, MessageSquare, Users, Clock, HelpCircle } from 'lucide-react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApp } from '@/src/contexts/AppContext';
import { AgentStatus } from '@/src/types';

export default function AgentProfileScreen() {
  const router = useRouter();
  const { agent, logout } = useAuth();
  const { sessions } = useApp();

  const [status, setStatus] = useState<AgentStatus>(agent?.status || AgentStatus.ONLINE);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [quickReply, setQuickReply] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>([
    '您好，有什么可以帮助您的？',
    '感谢您的咨询，稍等片刻，我正在查询相关信息。',
    '抱歉给您带来不便，我们会尽快解决这个问题。',
    '请问还有其他问题需要帮助吗？'
  ]);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('退出登录时出错:', error);
      Alert.alert('退出错误', '退出登录时发生错误，请重试');
    }
  };

  // 添加快捷回复
  const handleAddQuickReply = () => {
    if (!quickReply.trim()) return;

    setQuickReplies([...quickReplies, quickReply]);
    setQuickReply('');
  };

  // 删除快捷回复
  const handleRemoveQuickReply = (index: number) => {
    const updatedReplies = [...quickReplies];
    updatedReplies.splice(index, 1);
    setQuickReplies(updatedReplies);
  };

  // 统计数据
  const activeChats = sessions.filter(s => s.status === 'active' && s.agentId === agent?.id).length;
  const pendingChats = sessions.filter(s => s.status === 'pending').length;
  const resolvedChats = sessions.filter(s => s.status === 'resolved' && s.agentId === agent?.id).length;

  // 获取状态颜色
  const getStatusColor = (agentStatus: AgentStatus) => {
    switch (agentStatus) {
      case AgentStatus.ONLINE:
        return '#34C759'; // 绿色
      case AgentStatus.BUSY:
        return '#FF9500'; // 橙色
      case AgentStatus.OFFLINE:
        return '#8E8E93'; // 灰色
      default:
        return '#8E8E93';
    }
  };

  // 获取状态文本
  const getStatusText = (agentStatus: AgentStatus) => {
    switch (agentStatus) {
      case AgentStatus.ONLINE:
        return '在线';
      case AgentStatus.BUSY:
        return '忙碌';
      case AgentStatus.OFFLINE:
        return '离线';
      default:
        return agentStatus;
    }
  };

  // 切换状态
  const handleStatusChange = (newStatus: AgentStatus) => {
    setStatus(newStatus);
    // 在实际应用中，这里应该调用API更新客服状态
  };

  return (
    <ScrollView style={styles.container}>
      {/* 客服个人信息 */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{agent?.name || '客服'}</Text>
          <Text style={styles.id}>ID: {agent?.id || 'Unknown'}</Text>
          <Text style={styles.status}>状态: {getStatusText(status)}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* 状态切换 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>客服状态</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              status === AgentStatus.ONLINE && styles.activeStatusButton,
              { borderColor: getStatusColor(AgentStatus.ONLINE) }
            ]}
            onPress={() => handleStatusChange(AgentStatus.ONLINE)}
          >
            <Text style={[
              styles.statusButtonText,
              status === AgentStatus.ONLINE && { color: getStatusColor(AgentStatus.ONLINE) }
            ]}>
              在线
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              status === AgentStatus.BUSY && styles.activeStatusButton,
              { borderColor: getStatusColor(AgentStatus.BUSY) }
            ]}
            onPress={() => handleStatusChange(AgentStatus.BUSY)}
          >
            <Text style={[
              styles.statusButtonText,
              status === AgentStatus.BUSY && { color: getStatusColor(AgentStatus.BUSY) }
            ]}>
              忙碌
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              status === AgentStatus.OFFLINE && styles.activeStatusButton,
              { borderColor: getStatusColor(AgentStatus.OFFLINE) }
            ]}
            onPress={() => handleStatusChange(AgentStatus.OFFLINE)}
          >
            <Text style={[
              styles.statusButtonText,
              status === AgentStatus.OFFLINE && { color: getStatusColor(AgentStatus.OFFLINE) }
            ]}>
              离线
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 会话统计 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>会话统计</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#007AFF' }]}>
              <MessageSquare size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{activeChats}</Text>
            <Text style={styles.statLabel}>活跃会话</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FF9500' }]}>
              <Clock size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{pendingChats}</Text>
            <Text style={styles.statLabel}>待处理</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#34C759' }]}>
              <Users size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{resolvedChats}</Text>
            <Text style={styles.statLabel}>已解决</Text>
          </View>
        </View>
      </View>

      {/* 设置选项 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>设置</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color="#007AFF" />
            <Text style={styles.settingLabel}>通知提醒</Text>
          </View>
          <Switch
            value={enableNotifications}
            onValueChange={setEnableNotifications}
            trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Users size={20} color="#007AFF" />
            <Text style={styles.settingLabel}>自动分配会话</Text>
          </View>
          <Switch
            value={autoAssign}
            onValueChange={setAutoAssign}
            trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={styles.settingButton}>
          <Settings size={20} color="#007AFF" />
          <Text style={styles.settingButtonText}>更多设置</Text>
        </TouchableOpacity>
      </View>

      {/* 快捷回复 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>快捷回复</Text>

        <View style={styles.quickReplyInput}>
          <TextInput
            style={styles.input}
            placeholder="添加新的快捷回复..."
            value={quickReply}
            onChangeText={setQuickReply}
            multiline
          />
          <TouchableOpacity
            style={[styles.addButton, !quickReply.trim() && styles.disabledButton]}
            onPress={handleAddQuickReply}
            disabled={!quickReply.trim()}
          >
            <Text style={styles.addButtonText}>添加</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickRepliesList}>
          {quickReplies.map((reply, index) => (
            <View key={index} style={styles.quickReplyItem}>
              <Text style={styles.quickReplyText} numberOfLines={2}>{reply}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveQuickReply(index)}
              >
                <Text style={styles.removeButtonText}>删除</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* 帮助与支持 */}
      <TouchableOpacity style={styles.helpButton}>
        <HelpCircle size={20} color="#007AFF" />
        <Text style={styles.helpButtonText}>帮助与支持</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  id: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#8E8E93',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeStatusButton: {
    backgroundColor: '#F5F5F5',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#000000',
    marginLeft: 12,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#007AFF',
    marginLeft: 12,
  },
  quickReplyInput: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    minHeight: 40,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  quickRepliesList: {
    marginTop: 8,
  },
  quickReplyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  quickReplyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#000000',
  },
  removeButton: {
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  helpButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#007AFF',
    marginLeft: 8,
  },
}); 