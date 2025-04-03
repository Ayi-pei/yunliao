import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { AgentData, Customer, ChatSession, AgentStatus } from '../../types';
import { Circle, Search, Zap, MoreHorizontal } from 'lucide-react-native';

interface AgentPanelProps {
  agent: AgentData;
  customers: Customer[];
  sessions: ChatSession[];
  quickReplies: string[];
  onStatusChange: (status: AgentStatus) => void;
  onSelectChat: (sessionId: string) => void;
  onSendQuickReply: (text: string, sessionId: string) => void;
}

// 计算屏幕宽度，用于在小屏幕上调整UI
const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

const AgentPanel: React.FC<AgentPanelProps> = ({
  agent,
  customers,
  sessions,
  quickReplies,
  onStatusChange,
  onSelectChat,
  onSendQuickReply,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // 根据搜索关键词过滤用户
  const filteredCustomers = searchQuery
    ? customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
    )
    : customers;

  // 获取会话对应的客户信息
  const getCustomerForSession = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  // 根据会话状态获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'pending': return '#FF9500';
      case 'resolved': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  // 根据客服状态获取状态颜色
  const getAgentStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.ONLINE: return '#34C759';
      case AgentStatus.BUSY: return '#FF9500';
      case AgentStatus.OFFLINE: return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  // 渲染客服状态选择器
  const renderStatusSelector = () => (
    <View style={styles.statusSelector}>
      <TouchableOpacity
        style={[
          styles.statusOption,
          agent.status === AgentStatus.ONLINE && styles.statusOptionActive,
        ]}
        onPress={() => onStatusChange(AgentStatus.ONLINE)}
      >
        <Circle
          size={12}
          fill={getAgentStatusColor(AgentStatus.ONLINE)}
          color={getAgentStatusColor(AgentStatus.ONLINE)}
        />
        <Text style={styles.statusText}>在线</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.statusOption,
          agent.status === AgentStatus.BUSY && styles.statusOptionActive,
        ]}
        onPress={() => onStatusChange(AgentStatus.BUSY)}
      >
        <Circle
          size={12}
          fill={getAgentStatusColor(AgentStatus.BUSY)}
          color={getAgentStatusColor(AgentStatus.BUSY)}
        />
        <Text style={styles.statusText}>忙碌</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.statusOption,
          agent.status === AgentStatus.OFFLINE && styles.statusOptionActive,
        ]}
        onPress={() => onStatusChange(AgentStatus.OFFLINE)}
      >
        <Circle
          size={12}
          fill={getAgentStatusColor(AgentStatus.OFFLINE)}
          color={getAgentStatusColor(AgentStatus.OFFLINE)}
        />
        <Text style={styles.statusText}>离线</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染客服信息
  const renderAgentInfo = () => (
    <View style={styles.agentInfo}>
      <View style={styles.agentHeader}>
        <Text style={styles.agentName}>{agent.name}</Text>
        {renderStatusSelector()}
      </View>
      <View style={styles.agentStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{agent.activeChats}</Text>
          <Text style={styles.statLabel}>活跃会话</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{agent.totalResolved}</Text>
          <Text style={styles.statLabel}>已解决</Text>
        </View>
      </View>
    </View>
  );

  // 渲染搜索框
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Search size={18} color="#8E8E93" />
      <TextInput
        style={styles.searchInput}
        placeholder="搜索客户..."
        placeholderTextColor="#8E8E93"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  // 渲染用户列表
  const renderCustomerItem = ({ item }: { item: Customer }) => {
    // 找到该客户的会话
    const customerSession = sessions.find(s => s.customerId === item.id);

    return (
      <TouchableOpacity
        style={[
          styles.customerItem,
          selectedSession === customerSession?.id && styles.selectedCustomer,
        ]}
        onPress={() => {
          if (customerSession) {
            setSelectedSession(customerSession.id);
            onSelectChat(customerSession.id);
          }
        }}
      >
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerContact}>
            {item.email || item.phone || '无联系方式'}
          </Text>
        </View>
        {customerSession && (
          <View
            style={[
              styles.sessionStatus,
              { backgroundColor: getStatusColor(customerSession.status) },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  // 渲染快捷回复列表
  const renderQuickReplies = () => (
    <View style={styles.quickRepliesContainer}>
      <Text style={styles.sectionTitle}>快捷回复</Text>
      <ScrollView horizontal={isSmallScreen} showsHorizontalScrollIndicator={false}>
        {quickReplies.map((reply, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickReplyItem}
            onPress={() => {
              if (selectedSession) {
                onSendQuickReply(reply, selectedSession);
              }
            }}
            disabled={!selectedSession}
          >
            <Zap size={14} color="#007AFF" />
            <Text style={styles.quickReplyText}>
              {reply.length > 30 ? reply.substring(0, 30) + '...' : reply}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderAgentInfo()}
      {renderSearchBar()}

      <View style={styles.customersContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>客户列表</Text>
          <TouchableOpacity>
            <MoreHorizontal size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.customersList}
        />
      </View>

      {renderQuickReplies()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
    width: isSmallScreen ? '100%' : 320,
    borderRadius: 8,
    padding: 16,
    margin: 8,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    }),
    elevation: 1,
  },
  agentInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
  statusSelector: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 4,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
    color: '#000000',
  },
  agentStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: '#000000',
    fontFamily: 'Inter_400Regular',
  },
  customersContainer: {
    flex: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
  customersList: {
    flex: 1,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  selectedCustomer: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#000000',
  },
  customerContact: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  sessionStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  quickRepliesContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  quickReplyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginTop: 8,
    maxWidth: isSmallScreen ? 200 : 280,
  },
  quickReplyText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
});

export default AgentPanel; 