import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
// @ts-ignore
import { useRouter } from 'expo-router';
import { Search, MessageCircle, Circle, Filter } from 'lucide-react-native';
// @ts-ignore
import { formatDistanceToNow } from 'date-fns';
import { useApp } from '@/src/contexts/AppContext';
import { ChatSession, ChatStatus } from '@/src/types';

export default function ChatListScreen() {
  const router = useRouter();
  const { sessions, customers, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 处理搜索和过滤
  const filteredSessions = sessions.filter(session => {
    // 应用状态过滤
    if (statusFilter && session.status !== statusFilter) {
      return false;
    }
    
    // 搜索过滤 - 根据客户名称或ID搜索
    if (searchQuery) {
      const customer = customers.find(c => c.id === session.customerId);
      if (!customer) return false;
      
      const nameMatch = customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const idMatch = session.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      return nameMatch || idMatch;
    }
    
    return true;
  });

  // 处理会话点击，导航到会话详情
  const handleSessionPress = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  // 处理下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    // 实际应用中，这里应该调用重新加载数据的函数
    // 例如: await reloadSessions();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case ChatStatus.ACTIVE:
        return '#34C759'; // 绿色
      case ChatStatus.PENDING:
        return '#FF9500'; // 橙色
      case ChatStatus.RESOLVED:
        return '#8E8E93'; // 灰色
      default:
        return '#8E8E93';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case ChatStatus.ACTIVE:
        return '进行中';
      case ChatStatus.PENDING:
        return '待处理';
      case ChatStatus.RESOLVED:
        return '已解决';
      default:
        return status;
    }
  };

  // 会话项渲染
  const renderSessionItem = ({ item }: { item: ChatSession }) => {
    const customer = customers.find(c => c.id === item.customerId);
    if (!customer) return null;

    return (
      <TouchableOpacity
        style={styles.sessionItem}
        onPress={() => handleSessionPress(item.id)}
      >
        <View style={styles.sessionInfo}>
          <View style={styles.sessionHeader}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.timestamp}>
              {item.lastMessageTime ? 
                formatDistanceToNow(new Date(item.lastMessageTime), { addSuffix: true }) : 
                formatDistanceToNow(new Date(item.startTime), { addSuffix: true })}
            </Text>
          </View>
          
          <View style={styles.sessionMeta}>
            <View style={styles.statusContainer}>
              <Circle
                size={8}
                fill={getStatusColor(item.status)}
                color={getStatusColor(item.status)}
              />
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
            
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染状态过滤按钮
  const renderFilterButton = (status: string | null, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        statusFilter === status && styles.activeFilterButton,
      ]}
      onPress={() => setStatusFilter(status)}
    >
      {status && (
        <Circle
          size={8}
          fill={status ? getStatusColor(status) : '#8E8E93'}
          color={status ? getStatusColor(status) : '#8E8E93'}
          style={styles.filterIcon}
        />
      )}
      <Text
        style={[
          styles.filterText,
          statusFilter === status && styles.activeFilterText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // 如果正在加载，显示加载指示器
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>加载会话列表...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={16} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索会话..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filtersContainer}>
        {renderFilterButton(null, '全部')}
        {renderFilterButton(ChatStatus.ACTIVE, '进行中')}
        {renderFilterButton(ChatStatus.PENDING, '待处理')}
        {renderFilterButton(ChatStatus.RESOLVED, '已解决')}
        
        <TouchableOpacity style={styles.moreFiltersButton}>
          <Filter size={16} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {filteredSessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={40} color="#8E8E93" />
          <Text style={styles.emptyText}>暂无会话</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? '没有符合搜索条件的会话' : '当前没有任何客户会话'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sessionsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#000000',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  moreFiltersButton: {
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionsList: {
    paddingHorizontal: 16,
  },
  sessionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
});