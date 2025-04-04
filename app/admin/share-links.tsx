import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/contexts/AuthContext';
import * as Clipboard from 'expo-clipboard';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, BarChart2, Copy, Download, Link, Plus, XCircle } from 'lucide-react-native';
import { nanoid } from 'nanoid';
import QRCode from 'react-native-qrcode-svg';
// 引入文件系统模块（用于保存QR码）
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

interface ShareLink {
    id: string;
    url: string;
    createdAt: string;
    visits: number;
    active: boolean;
}

export default function ShareLinksScreen() {
    const router = useRouter();
    const { agent } = useAuth();

    const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    // 创建QR码引用对象
    const qrCodeRefs = React.useRef<{ [key: string]: React.RefObject<any> }>({});

    // 模拟数据加载
    useEffect(() => {
        // 加载分享链接数据
        const mockLinks: ShareLink[] = [
            {
                id: 'link_001',
                url: `https://chat.example.com/cs/${agent?.id || 'unknown'}?ref=${nanoid(5)}`,
                createdAt: '2023-07-01',
                visits: 45,
                active: true
            },
            {
                id: 'link_002',
                url: `https://chat.example.com/cs/${agent?.id || 'unknown'}?ref=${nanoid(5)}`,
                createdAt: '2023-07-10',
                visits: 23,
                active: true
            }
        ];
        setShareLinks(mockLinks);

        // 为每个链接创建引用
        mockLinks.forEach(link => {
            qrCodeRefs.current[link.id] = React.createRef();
        });
    }, [agent]);

    // 生成分享链接
    const handleGenerateLink = () => {
        setIsGenerating(true);

        // 模拟API请求延迟
        setTimeout(() => {
            const newLinkId = `link_${Date.now()}`;
            const newLink: ShareLink = {
                id: newLinkId,
                url: `https://chat.example.com/cs/${agent?.id || 'unknown'}?ref=${nanoid(5)}`,
                createdAt: new Date().toISOString().split('T')[0],
                visits: 0,
                active: true
            };

            // 为新链接创建引用
            qrCodeRefs.current[newLinkId] = React.createRef();

            setShareLinks([newLink, ...shareLinks]);
            setIsGenerating(false);
            Alert.alert('成功', '新的分享链接已生成');
        }, 1000);
    };

    // 复制链接
    const handleCopyLink = async (url: string) => {
        try {
            await Clipboard.setStringAsync(url);
            Alert.alert('成功', '链接已复制到剪贴板');
        } catch (error) {
            console.error('复制链接失败:', error);
            Alert.alert('错误', '复制链接失败，请重试');
        }
    };

    // 保存/复制QR码
    const handleCopyQRCode = async (linkId: string) => {
        try {
            const ref = qrCodeRefs.current[linkId];
            if (!ref || !ref.current) {
                throw new Error('无法获取QR码引用');
            }

            // 捕获QR码视图为图像
            const uri = await captureRef(ref, {
                format: 'png',
                quality: 0.9,
            });

            if (Platform.OS === 'web') {
                // Web平台 - 创建下载链接
                const link = document.createElement('a');
                link.href = uri;
                link.download = `分享链接_${linkId}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                Alert.alert('成功', 'QR码已下载');
            } else {
                // 移动平台 - 使用分享功能
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: '保存或分享QR码',
                });
            }
        } catch (error) {
            console.error('保存QR码失败:', error);
            Alert.alert('错误', '保存QR码失败，请重试');
        }
    };

    // 停用链接
    const handleDeactivateLink = (linkId: string) => {
        Alert.alert(
            '确认停用',
            '确定要停用此分享链接吗？停用后，用户将无法通过此链接联系您。',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '确定',
                    style: 'destructive',
                    onPress: () => {
                        setShareLinks(shareLinks.map(link =>
                            link.id === linkId ? { ...link, active: false } : link
                        ));
                        Alert.alert('成功', '链接已停用');
                    }
                }
            ]
        );
    };

    // 查看链接统计
    const handleViewStats = (linkId: string) => {
        const link = shareLinks.find(l => l.id === linkId);
        if (link) {
            Alert.alert(
                '链接统计',
                `创建时间: ${link.createdAt}\n访问量: ${link.visits}\n状态: ${link.active ? '活跃' : '已停用'}`
            );
        }
    };

    // 过滤链接
    const filteredLinks = shareLinks.filter(link =>
        link.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 渲染链接项
    const renderLinkItem = ({ item }: { item: ShareLink }) => (
        <View style={styles.linkItem}>
            <View style={styles.linkHeader}>
                <Text style={styles.linkDate}>{item.createdAt}</Text>
                <Text style={[styles.linkStatus, item.active ? styles.activeStatus : styles.inactiveStatus]}>
                    {item.active ? '活跃' : '已停用'}
                </Text>
            </View>

            <Text style={styles.linkUrl} numberOfLines={1}>{item.url}</Text>

            <View style={styles.linkStats}>
                <Text style={styles.visitCount}>访问量: {item.visits}</Text>
            </View>

            <View style={styles.qrCodeContainer} ref={qrCodeRefs.current[item.id]}>
                <QRCode value={item.url} size={120} />
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCopyLink(item.url)}
                >
                    <Copy size={16} color={COLORS.primary} />
                    <Text style={styles.actionText}>复制链接</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCopyQRCode(item.id)}
                >
                    <Download size={16} color={COLORS.primary} />
                    <Text style={styles.actionText}>保存二维码</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewStats(item.id)}
                >
                    <BarChart2 size={16} color={COLORS.primary} />
                    <Text style={styles.actionText}>统计</Text>
                </TouchableOpacity>

                {item.active && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deactivateButton]}
                        onPress={() => handleDeactivateLink(item.id)}
                    >
                        <XCircle size={16} color={COLORS.danger} />
                        <Text style={styles.deactivateText}>停用</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: '分享链接管理',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.header}>
                <Text style={styles.title}>分享链接管理</Text>
                <Text style={styles.subtitle}>
                    创建和管理您的客服分享链接
                </Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                    onPress={handleGenerateLink}
                    disabled={isGenerating}
                >
                    <Plus size={18} color="#FFFFFF" />
                    <Text style={styles.generateButtonText}>
                        {isGenerating ? '生成中...' : '创建新链接'}
                    </Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder="搜索链接..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    {...(Platform.OS === 'web' ? {
                        autoComplete: 'off',
                        spellCheck: false,
                        autoCorrect: false
                    } : {})}
                />
            </View>

            {filteredLinks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Link size={40} color={COLORS.gray} />
                    <Text style={styles.emptyText}>
                        {searchQuery ? '没有找到匹配的链接' : '暂无分享链接'}
                    </Text>
                    {!searchQuery && (
                        <Text style={styles.emptySubtext}>
                            点击"创建新链接"按钮来生成您的第一个分享链接
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredLinks}
                    renderItem={renderLinkItem}
                    keyExtractor={(item: ShareLink) => item.id}
                    contentContainerStyle={styles.linksList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    backButton: {
        marginLeft: 8,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.gray,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray5,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
    },
    generateButtonDisabled: {
        backgroundColor: COLORS.gray,
    },
    generateButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        marginLeft: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: COLORS.gray5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
    },
    linksList: {
        padding: 16,
    },
    linkItem: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
            },
        }),
    },
    linkHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    linkDate: {
        fontSize: 14,
        color: COLORS.gray,
    },
    linkStatus: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        overflow: 'hidden',
    },
    activeStatus: {
        backgroundColor: '#E3F2FD',
        color: COLORS.primary,
    },
    inactiveStatus: {
        backgroundColor: '#FFEBEE',
        color: COLORS.danger,
    },
    linkUrl: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 8,
    },
    linkStats: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    visitCount: {
        fontSize: 14,
        color: COLORS.gray,
    },
    qrCodeContainer: {
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: COLORS.gray5,
        paddingTop: 12,
        flexWrap: 'wrap',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 14,
        color: COLORS.primary,
    },
    deactivateButton: {

    },
    deactivateText: {
        marginLeft: 4,
        fontSize: 14,
        color: COLORS.danger,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.gray,
        textAlign: 'center',
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        maxWidth: 300,
    },
}); 