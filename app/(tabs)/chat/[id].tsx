import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
// @ts-ignore
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, MoreVertical, CheckCheck, Ban } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/src/contexts/AppContext';
import ChatMessage from '@/src/components/chat/ChatMessage';
import MessageInput from '@/src/components/chat/MessageInput';
import { Message, MessageType, ChatStatus } from '@/src/types';

export default function ChatDetailScreen() {
  const params = useLocalSearchParams();
  const sessionId = params.id as string;
  const router = useRouter();

  // @ts-ignore
  const {
    agent,
    messages,
    sessions,
    customers,
    sendMessage,
    loadMoreMessages,
    resolveSession,
    isLoading,
    error,
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  // 获取当前会话和客户信息
  const currentSession = sessions.find(s => s.id === sessionId);
  const customer = currentSession
    ? customers.find(c => c.id === currentSession.customerId)
    : null;
  const sessionMessages = messages[sessionId] || [];

  // 在消息发生变化时滚动到底部
  useEffect(() => {
    if (sessionMessages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [sessionMessages.length]);

  // 处理发送消息
  const handleSendMessage = async (
    content: string,
    type: MessageType,
    attachments?: any[]
  ) => {
    try {
      // 修复参数数量问题，根据AppContext.tsx中sendMessage的定义调整
      await sendMessage(sessionId, content, type);
    } catch (error) {
      console.error('发送消息失败', error);
    }
  };

  // 加载更多消息
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);
    try {
      const hasMore = await loadMoreMessages(sessionId);
      setHasMoreMessages(hasMore);
    } catch (error) {
      console.error('加载更多消息失败', error);
      setHasMoreMessages(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 处理语音录制开始
  const handleStartRecording = () => {
    setIsRecording(true);
    // 在这里实现实际的录音逻辑
    // 可以使用 expo-av 库进行录音
  };

  // 处理语音录制结束
  const handleStopRecording = () => {
    setIsRecording(false);
    // 在这里处理录音结果
    // 假设我们获得了录音的URI
    const mockVoiceUri = "file://voice-recording.m4a";
    setVoiceUri(mockVoiceUri);

    if (mockVoiceUri) {
      handleSendMessage('语音消息', MessageType.VOICE, [{
        url: mockVoiceUri,
        type: 'audio/m4a',
        name: `voice_${Date.now()}.m4a`,
      }]);
    }
  };

  // 解决会话
  const handleResolveSession = async () => {
    if (!currentSession) return;

    try {
      await resolveSession(sessionId);
      // 导航回列表
      router.back();
    } catch (error) {
      console.error('解决会话失败', error);
    }
  };

  // 判断当前会话是否已解决
  const isResolved = currentSession?.status === ChatStatus.RESOLVED;

  // 如果正在加载数据，显示加载指示器
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>加载聊天数据...</Text>
      </View>
    );
  }

  // 如果没有找到会话或客户，显示错误信息
  if (!currentSession || !customer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>找不到聊天会话</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* 自定义头部 */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.statusText}>
                {isResolved ? '已解决' : currentSession.status === ChatStatus.ACTIVE ? '进行中' : '待处理'}
              </Text>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleResolveSession}
                disabled={isResolved}
              >
                <CheckCheck size={24} color={isResolved ? "#8E8E93" : "#34C759"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MoreVertical size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* 消息列表 */}
      <FlatList
        ref={flatListRef}
        data={sessionMessages}
        renderItem={({ item }) => (
          <ChatMessage
            message={item}
            isCurrentUser={item.senderType === 'agent'}
            onPress={() => {
              // 处理消息点击，例如查看大图
            }}
            onLongPress={() => {
              // 处理长按，例如复制、删除等操作
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          isLoadingMore && hasMoreMessages ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#8E8E93" />
              <Text style={styles.loadingMoreText}>加载更多消息...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无消息</Text>
          </View>
        }
      />

      {/* 输入框 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <MessageInput
          sessionId={sessionId}
          onSendMessage={handleSendMessage}
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          disabled={isResolved}
        />
      </KeyboardAvoidingView>

      {/* 已解决会话提示 */}
      {isResolved && (
        <View style={styles.resolvedBanner}>
          <Ban size={16} color="#8E8E93" />
          <Text style={styles.resolvedText}>此会话已解决</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    alignItems: 'center',
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  messageList: {
    padding: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FF3B30',
    marginBottom: 16,
  },
  errorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  emptyContainer: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  resolvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    paddingVertical: 4,
  },
  resolvedText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
});