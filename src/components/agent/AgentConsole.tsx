import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, Switch, Platform } from 'react-native';
import { User, MessageSquare, Shield, Link2, Clock, Users, UserX, Paperclip, Send, Smile, List } from 'lucide-react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApp } from '@/src/contexts/AppContext';
import { AgentStatus, Message } from '@/src/types';
import TouchableView from '@/src/components/common/TouchableView';

interface EmojiData {
    emoji: string;
}

interface AgentConsoleProps {
    className?: string;
}

interface ExtendedCustomer {
    id: string;
    name: string;
    avatar?: string;
    lastMessage?: Date;
    unreadCount?: number;
    ipAddress?: string;
    device?: string;
    isOnline: boolean;
    firstVisit: string;
}

interface ExtendedMessage {
    id: string;
    content: string;
    senderId: string;
    receiverId?: string;
    customerId?: string;
    timestamp?: string | Date;
    read?: boolean;
    type: 'text' | 'image' | 'file' | 'voice';
}

interface ShareLink {
    id: string;
    url: string;
    createdAt: string;
    visits: number;
    active: boolean;
}

const AgentConsole = ({ className }: AgentConsoleProps) => {
    const { agent } = useAuth();
    const { sessions } = useApp();

    // 状态管理
    const [selectedCustomer, setSelectedCustomer] = useState<ExtendedCustomer | null>(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<ExtendedMessage[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const [quickReplies, setQuickReplies] = useState([
        '您好，很高兴为您服务！',
        '请问还有其他问题需要帮助吗？',
        '稍等片刻，我正在查询相关信息。',
        '感谢您的咨询，祝您使用愉快！'
    ]);
    const [newQuickReply, setNewQuickReply] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('您好，欢迎咨询在线客服，请问有什么可以帮助您的？');
    const [blacklistedUsers, setBlacklistedUsers] = useState<string[]>([]);
    const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [activeTab, setActiveTab] = useState('customers'); // 'customers', 'blacklist', 'sharelinks'

    // 模拟客户数据
    const [customers, setCustomers] = useState<ExtendedCustomer[]>([
        {
            id: 'cust_001',
            name: '李明',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            unreadCount: 2,
            ipAddress: '192.168.1.101',
            device: 'iPhone 13',
            isOnline: true,
            firstVisit: '2023-05-15'
        },
        {
            id: 'cust_002',
            name: '王芳',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            unreadCount: 0,
            ipAddress: '192.168.1.102',
            device: 'Android Samsung',
            isOnline: true,
            firstVisit: '2023-06-20'
        },
        {
            id: 'cust_003',
            name: '张伟',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            unreadCount: 1,
            ipAddress: '192.168.1.103',
            device: 'Windows Chrome',
            isOnline: false,
            firstVisit: '2023-04-10'
        }
    ]);

    // 模拟消息数据
    useEffect(() => {
        if (selectedCustomer) {
            const mockMessages: ExtendedMessage[] = [
                {
                    id: 'msg_001',
                    content: '您好，我有一个关于产品功能的问题',
                    senderId: selectedCustomer.id,
                    timestamp: '2023-07-15T10:30:00',
                    read: true,
                    type: 'text'
                },
                {
                    id: 'msg_002',
                    content: '您好，请问有什么可以帮助您的？',
                    senderId: agent?.id || 'agent',
                    customerId: selectedCustomer.id,
                    timestamp: '2023-07-15T10:31:00',
                    read: true,
                    type: 'text'
                },
                {
                    id: 'msg_003',
                    content: '我想了解一下新版本的更新内容',
                    senderId: selectedCustomer.id,
                    timestamp: '2023-07-15T10:32:00',
                    read: true,
                    type: 'text'
                }
            ];
            setMessages(mockMessages);
        } else {
            setMessages([]);
        }
    }, [selectedCustomer, agent]);

    // 模拟分享链接数据
    useEffect(() => {
        const mockShareLinks: ShareLink[] = [
            {
                id: 'link_001',
                url: 'https://chat.example.com/support?ref=abc123',
                createdAt: '2023-07-01',
                visits: 45,
                active: true
            },
            {
                id: 'link_002',
                url: 'https://chat.example.com/support?ref=def456',
                createdAt: '2023-07-10',
                visits: 23,
                active: true
            }
        ];
        setShareLinks(mockShareLinks);
    }, []);

    // 处理客户选择
    const handleCustomerSelect = (customer: ExtendedCustomer) => {
        setSelectedCustomer(customer);
        // 标记消息为已读
        if (customer.unreadCount && customer.unreadCount > 0) {
            setCustomers(customers.map(c =>
                c.id === customer.id ? { ...c, unreadCount: 0 } : c
            ));
        }
    };

    // 发送消息
    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedCustomer) return;

        const newMessage: ExtendedMessage = {
            id: `msg_${Date.now()}`,
            content: messageText,
            senderId: agent?.id || 'agent',
            customerId: selectedCustomer.id,
            timestamp: new Date(),
            type: 'text'
        };

        setMessages([...messages, newMessage]);
        setMessageText('');
    };

    // 表情选择
    const handleEmojiClick = (emojiData: EmojiData) => {
        setMessageText(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    // 快捷回复
    const handleQuickReplyClick = (content: string) => {
        setMessageText(content);
        setShowQuickReplies(false);
    };

    // 添加快捷回复
    const handleAddQuickReply = () => {
        if (!newQuickReply.trim()) return;
        setQuickReplies([...quickReplies, newQuickReply]);
        setNewQuickReply('');
    };

    // 删除快捷回复
    const handleDeleteQuickReply = (index: number) => {
        const updatedReplies = [...quickReplies];
        updatedReplies.splice(index, 1);
        setQuickReplies(updatedReplies);
    };

    // 更新欢迎消息
    const handleWelcomeMessageUpdate = () => {
        Alert.alert('成功', '欢迎消息已更新');
    };

    // 黑名单管理
    const handleAddToBlacklist = () => {
        if (!selectedCustomer) return;

        Alert.alert(
            '确认操作',
            `确定将用户 ${selectedCustomer.name} 加入黑名单？`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '确定',
                    style: 'destructive',
                    onPress: () => {
                        setBlacklistedUsers([...blacklistedUsers, selectedCustomer.id]);
                        setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
                        setSelectedCustomer(null);
                        Alert.alert('已将用户加入黑名单');
                    }
                }
            ]
        );
    };

    // 从黑名单中移除
    const handleRemoveFromBlacklist = (id: string) => {
        const targetUser = customers.find(c => c.id === id) ||
            { id, name: `用户${id}`, isOnline: false, firstVisit: '未知' };

        setBlacklistedUsers(blacklistedUsers.filter(userId => userId !== id));
        if (!customers.some(c => c.id === id)) {
            setCustomers([...customers, targetUser as ExtendedCustomer]);
        }
        Alert.alert('已从黑名单中移除用户');
    };

    // 生成分享链接
    const handleGenerateShareLink = () => {
        setIsGeneratingLink(true);
        // 模拟API请求延迟
        setTimeout(() => {
            const newLink: ShareLink = {
                id: `link_${Date.now()}`,
                url: `https://chat.example.com/support?ref=${Math.random().toString(36).substring(2, 8)}`,
                createdAt: new Date().toISOString().split('T')[0],
                visits: 0,
                active: true
            };
            setShareLinks([...shareLinks, newLink]);
            setIsGeneratingLink(false);
            Alert.alert('成功', '新的分享链接已生成');
        }, 1000);
    };

    // 复制链接
    const handleCopyLink = (url: string) => {
        Alert.alert('成功', '链接已复制到剪贴板');
    };

    // 停用链接
    const handleDeactivateLink = (linkId: string) => {
        setShareLinks(shareLinks.map(link =>
            link.id === linkId ? { ...link, active: false } : link
        ));
        Alert.alert('成功', '链接已停用');
    };

    // 查看链接统计
    const handleViewLinkStats = (linkId: string) => {
        Alert.alert('链接统计', `访问量: ${shareLinks.find(link => link.id === linkId)?.visits || 0}`);
    };

    // 渲染客户列表项
    const renderCustomerItem = (customer: ExtendedCustomer) => {
        return (
            <TouchableOpacity
                key={customer.id}
                style={[
                    styles.customerItem,
                    selectedCustomer?.id === customer.id && styles.selectedCustomer
                ]}
                onPress={() => handleCustomerSelect(customer)}
            >
                <TouchableView style={styles.customerAvatar}>
                    {customer.avatar ? (
                        <Image source={{ uri: customer.avatar }} style={styles.avatarImage} />
                    ) : (
                        <User size={24} color="#FFFFFF" />
                    )}
                    <TouchableView
                        style={[
                            styles.onlineIndicator,
                            { backgroundColor: customer.isOnline ? '#34C759' : '#8E8E93' }
                        ]}
                    />
                </TouchableView>

                <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <Text style={styles.customerMeta}>
                        {customer.device} • IP: {customer.ipAddress}
                    </Text>
                </View>

                {(customer.unreadCount && customer.unreadCount > 0) ? (
                    <TouchableView style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{customer.unreadCount}</Text>
                    </TouchableView>
                ) : null}
            </TouchableOpacity>
        );
    };

    // 渲染消息气泡
    const renderMessage = (message: ExtendedMessage) => {
        const isAgent = message.senderId === agent?.id || message.senderId === 'agent';

        return (
            <TouchableView
                key={message.id}
                style={[
                    styles.messageBubble,
                    isAgent ? styles.agentMessage : styles.customerMessage
                ]}
            >
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.messageTime}>
                    {typeof message.timestamp === 'string'
                        ? new Date(message.timestamp).toLocaleTimeString()
                        : message.timestamp instanceof Date
                            ? message.timestamp.toLocaleTimeString()
                            : ''}
                </Text>
            </TouchableView>
        );
    };

    // 渲染左侧面板
    const renderLeftPanel = () => {
        return (
            <View style={styles.leftPanel}>
                <View style={styles.tabButtons}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'customers' && styles.activeTabButton]}
                        onPress={() => setActiveTab('customers')}
                    >
                        <Users size={20} color={activeTab === 'customers' ? '#007AFF' : '#8E8E93'} />
                        <Text style={[styles.tabButtonText, activeTab === 'customers' && styles.activeTabText]}>
                            客户
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'blacklist' && styles.activeTabButton]}
                        onPress={() => setActiveTab('blacklist')}
                    >
                        <UserX size={20} color={activeTab === 'blacklist' ? '#007AFF' : '#8E8E93'} />
                        <Text style={[styles.tabButtonText, activeTab === 'blacklist' && styles.activeTabText]}>
                            黑名单
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'sharelinks' && styles.activeTabButton]}
                        onPress={() => setActiveTab('sharelinks')}
                    >
                        <Link2 size={20} color={activeTab === 'sharelinks' ? '#007AFF' : '#8E8E93'} />
                        <Text style={[styles.tabButtonText, activeTab === 'sharelinks' && styles.activeTabText]}>
                            分享链接
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'customers' && (
                    <ScrollView style={styles.customersList}>
                        <Text style={styles.panelTitle}>在线客户 ({customers.filter(c => c.isOnline).length})</Text>
                        {customers.filter(c => c.isOnline).map(renderCustomerItem)}

                        <Text style={styles.panelTitle}>离线客户 ({customers.filter(c => !c.isOnline).length})</Text>
                        {customers.filter(c => !c.isOnline).map(renderCustomerItem)}
                    </ScrollView>
                )}

                {activeTab === 'blacklist' && (
                    <ScrollView style={styles.blacklistContainer}>
                        <Text style={styles.panelTitle}>黑名单用户 ({blacklistedUsers.length})</Text>
                        {blacklistedUsers.length === 0 ? (
                            <Text style={styles.emptyListText}>黑名单为空</Text>
                        ) : (
                            blacklistedUsers.map(id => (
                                <TouchableView key={id} style={styles.blacklistItem}>
                                    <Text style={styles.blacklistUserName}>用户ID: {id}</Text>
                                    <TouchableOpacity
                                        style={styles.blacklistActionButton}
                                        onPress={() => handleRemoveFromBlacklist(id)}
                                    >
                                        <Text style={styles.blacklistActionText}>移除</Text>
                                    </TouchableOpacity>
                                </TouchableView>
                            ))
                        )}
                    </ScrollView>
                )}

                {activeTab === 'sharelinks' && (
                    <ScrollView style={styles.shareLinksContainer}>
                        <Text style={styles.panelTitle}>分享链接</Text>

                        <TouchableOpacity
                            style={[styles.generateLinkButton, isGeneratingLink && styles.disabledButton]}
                            onPress={handleGenerateShareLink}
                            disabled={isGeneratingLink}
                        >
                            <Link2 size={18} color="#FFFFFF" />
                            <Text style={styles.generateLinkText}>
                                {isGeneratingLink ? '生成中...' : '生成新链接'}
                            </Text>
                        </TouchableOpacity>

                        {shareLinks.map(link => (
                            <TouchableView key={link.id} style={styles.shareLinkItem}>
                                <View style={styles.shareLinkInfo}>
                                    <Text style={styles.shareLinkUrl} numberOfLines={1}>{link.url}</Text>
                                    <Text style={styles.shareLinkMeta}>
                                        创建: {link.createdAt} • 访问: {link.visits}
                                    </Text>
                                </View>

                                <View style={styles.shareLinkActions}>
                                    <TouchableOpacity
                                        style={styles.shareLinkAction}
                                        onPress={() => handleCopyLink(link.url)}
                                    >
                                        <Text style={styles.shareLinkActionText}>复制</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.shareLinkAction}
                                        onPress={() => handleViewLinkStats(link.id)}
                                    >
                                        <Text style={styles.shareLinkActionText}>统计</Text>
                                    </TouchableOpacity>

                                    {link.active && (
                                        <TouchableOpacity
                                            style={[styles.shareLinkAction, styles.deactivateAction]}
                                            onPress={() => handleDeactivateLink(link.id)}
                                        >
                                            <Text style={styles.deactivateActionText}>停用</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableView>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    };

    // 渲染右侧面板
    const renderChatPanel = () => {
        if (!selectedCustomer) {
            return (
                <View style={styles.emptyChat}>
                    <MessageSquare size={40} color="#E5E5EA" />
                    <Text style={styles.emptyChatText}>选择一个客户开始聊天</Text>
                </View>
            );
        }

        return (
            <View style={styles.chatPanel}>
                <View style={styles.chatHeader}>
                    <View style={styles.chatHeaderInfo}>
                        <Text style={styles.chatHeaderName}>{selectedCustomer.name}</Text>
                        <Text style={styles.chatHeaderMeta}>
                            首次访问: {selectedCustomer.firstVisit} • {selectedCustomer.device}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.blacklistButton}
                        onPress={handleAddToBlacklist}
                    >
                        <Shield size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.messagesContainer}>
                    {messages.map(renderMessage)}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={styles.inputButton}
                        onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile size={20} color="#8E8E93" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.inputButton}
                        onPress={() => setShowQuickReplies(!showQuickReplies)}
                    >
                        <List size={20} color="#8E8E93" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.inputButton}>
                        <Paperclip size={20} color="#8E8E93" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInput}
                        value={messageText}
                        onChangeText={setMessageText}
                        placeholder="输入消息..."
                        multiline
                    />

                    <TouchableOpacity
                        style={[styles.sendButton, !messageText.trim() && styles.disabledButton]}
                        onPress={handleSendMessage}
                        disabled={!messageText.trim()}
                    >
                        <Send size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {showEmojiPicker && (
                    <TouchableView style={styles.emojiPicker}>
                        <TouchableOpacity onPress={() => handleEmojiClick({ emoji: '😊' })}>
                            <Text style={styles.emojiItem}>😊</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEmojiClick({ emoji: '👍' })}>
                            <Text style={styles.emojiItem}>👍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEmojiClick({ emoji: '🙏' })}>
                            <Text style={styles.emojiItem}>🙏</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEmojiClick({ emoji: '🎉' })}>
                            <Text style={styles.emojiItem}>🎉</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEmojiClick({ emoji: '❤️' })}>
                            <Text style={styles.emojiItem}>❤️</Text>
                        </TouchableOpacity>
                    </TouchableView>
                )}

                {showQuickReplies && (
                    <TouchableView style={styles.quickRepliesContainer}>
                        <View style={styles.quickReplyInput}>
                            <TextInput
                                style={styles.quickReplyTextInput}
                                value={newQuickReply}
                                onChangeText={setNewQuickReply}
                                placeholder="添加新快捷回复..."
                            />
                            <TouchableOpacity
                                style={[styles.addQuickReplyButton, !newQuickReply.trim() && styles.disabledButton]}
                                onPress={handleAddQuickReply}
                                disabled={!newQuickReply.trim()}
                            >
                                <Text style={styles.addQuickReplyText}>添加</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.quickRepliesList}>
                            {quickReplies.map((reply, index) => (
                                <TouchableView key={index} style={styles.quickReplyItem}>
                                    <TouchableOpacity
                                        style={styles.quickReplyContent}
                                        onPress={() => handleQuickReplyClick(reply)}
                                    >
                                        <Text style={styles.quickReplyText} numberOfLines={2}>{reply}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteQuickReplyButton}
                                        onPress={() => handleDeleteQuickReply(index)}
                                    >
                                        <Text style={styles.deleteQuickReplyText}>删除</Text>
                                    </TouchableOpacity>
                                </TouchableView>
                            ))}
                        </ScrollView>
                    </TouchableView>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderLeftPanel()}
            {renderChatPanel()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F2F2F7',
    },
    leftPanel: {
        width: 280,
        borderRightWidth: 1,
        borderRightColor: '#E5E5EA',
        backgroundColor: '#FFFFFF',
    },
    tabButtons: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabButton: {
        borderBottomColor: '#007AFF',
    },
    tabButtonText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#8E8E93',
    },
    activeTabText: {
        color: '#007AFF',
    },
    panelTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        marginVertical: 10,
        paddingHorizontal: 16,
    },
    customersList: {
        flex: 1,
    },
    customerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    selectedCustomer: {
        backgroundColor: '#F2F2F7',
    },
    customerAvatar: {
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    onlineIndicator: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#34C759',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        bottom: 0,
        right: 0,
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 4,
    },
    customerMeta: {
        fontSize: 12,
        color: '#8E8E93',
    },
    unreadBadge: {
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    chatPanel: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    chatHeaderInfo: {
        flex: 1,
    },
    chatHeaderName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    chatHeaderMeta: {
        fontSize: 12,
        color: '#8E8E93',
    },
    blacklistButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFEEEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageBubble: {
        maxWidth: '70%',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
    },
    agentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    customerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#F2F2F7',
    },
    messageText: {
        fontSize: 16,
        color: '#000000',
    },
    messageTime: {
        marginTop: 4,
        fontSize: 10,
        color: '#8E8E93',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    inputButton: {
        padding: 8,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    emptyChat: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyChatText: {
        marginTop: 12,
        fontSize: 16,
        color: '#8E8E93',
    },
    emojiPicker: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        padding: 16,
    },
    emojiItem: {
        fontSize: 24,
        marginHorizontal: 8,
    },
    quickRepliesContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        maxHeight: 200,
    },
    quickReplyInput: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    quickReplyTextInput: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    addQuickReplyButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    addQuickReplyText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    quickRepliesList: {
        padding: 8,
    },
    quickReplyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        marginBottom: 8,
    },
    quickReplyContent: {
        flex: 1,
        padding: 12,
    },
    quickReplyText: {
        fontSize: 14,
    },
    deleteQuickReplyButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    deleteQuickReplyText: {
        color: '#FF3B30',
    },
    blacklistContainer: {
        flex: 1,
        padding: 16,
    },
    blacklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        marginBottom: 8,
    },
    blacklistUserName: {
        fontSize: 14,
        fontWeight: '500',
    },
    blacklistActionButton: {
        backgroundColor: '#FF3B30',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    blacklistActionText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#8E8E93',
    },
    shareLinksContainer: {
        flex: 1,
        padding: 16,
    },
    generateLinkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 16,
    },
    generateLinkText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    shareLinkItem: {
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    shareLinkInfo: {
        marginBottom: 8,
    },
    shareLinkUrl: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    shareLinkMeta: {
        fontSize: 12,
        color: '#8E8E93',
    },
    shareLinkActions: {
        flexDirection: 'row',
    },
    shareLinkAction: {
        backgroundColor: '#E5E5EA',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
    },
    shareLinkActionText: {
        fontSize: 12,
        color: '#000000',
    },
    deactivateAction: {
        backgroundColor: '#FFEEEE',
    },
    deactivateActionText: {
        color: '#FF3B30',
    },
});

export default AgentConsole; 