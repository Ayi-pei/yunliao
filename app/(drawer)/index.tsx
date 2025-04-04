import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
// @ts-ignore
import { formatDistanceToNow } from 'date-fns';

type ChatStatus = 'active' | 'pending' | 'resolved';

interface Chat {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: Date;
  status: ChatStatus;
  avatar: string;
  unreadCount: number;
}

const mockChats: Chat[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    lastMessage: 'I need help with my recent order #12345',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    unreadCount: 3,
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    lastMessage: 'When will my order be shipped?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    unreadCount: 0,
  },
  {
    id: '3',
    customerName: 'Emily Davis',
    lastMessage: 'Thank you for your help!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'resolved',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    unreadCount: 0,
  },
];

const getStatusColor = (status: ChatStatus) => {
  switch (status) {
    case 'active':
      return '#34C759';
    case 'pending':
      return '#FF9500';
    case 'resolved':
      return '#8E8E93';
  }
};

export default function ChatsScreen() {
  const [chats] = useState<Chat[]>(mockChats);

  // 使用 useMemo 缓存状态颜色映射
  const statusColors = useMemo(() => ({
    active: '#34C759',
    pending: '#FF9500',
    resolved: '#8E8E93',
  }), []);

  // 使用 useCallback 缓存渲染函数
  const renderChatItem = useCallback(({ item }: { item: Chat }) => (
    <Pressable 
      style={styles.chatItem}
      onPress={() => {
        // 处理点击事件
      }}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar}
          // 修改路径别名为相对路径
          loadingIndicatorSource={require('../../assets/images/icon.png')}
          defaultSource={require('../../assets/images/favicon.png')}
        />
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: statusColors[item.status] },
          ]}
        />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  ), [statusColors]);

  // 使用 useMemo 缓存 keyExtractor 函数
  const keyExtractor = useCallback((item: Chat) => item.id, []);

  // 使用 useMemo 缓存列表数据
  const chatListData = useMemo(() => chats, [chats]);

  return (
    <View style={styles.container}>
      <FlatList
        data={chatListData}
        renderItem={renderChatItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        // 添加性能优化配置
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
        // 添加下拉刷新功能
        refreshing={false}
        onRefresh={() => {
          // 处理刷新逻辑
        }}
        // 添加列表为空时的渲染
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无聊天记录</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  timestamp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#3C3C43',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
});