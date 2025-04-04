import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/contexts/AuthContext';
import { Permission } from '@/src/types/auth';
import * as Clipboard from 'expo-clipboard';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, BarChart2, Copy, Link, Plus, QrCode, XCircle } from 'lucide-react-native';
import { nanoid } from 'nanoid';

// 分享链接接口
interface ShareLink {
    id: string;
    url: string;
    createdAt: string;
    visits: number;
    active: boolean;
}

export default function ShareLinksScreen() {
    const router = useRouter();
    const { agent, hasPermission } = useAuth();

    // 检查权限
    const canManageLinks = hasPermission(Permission.MANAGE_SETTINGS) ||
        hasPermission(Permission.MANAGE_SYSTEM);

    const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // 模拟加载分享链接
    useEffect(() => {
        // 在实际应用中，应该从API获取链接
        const mockLinks: ShareLink[] = [
            {
                id: 'link_001',
                url: 'https://cs.example.com/link/abc123',
                createdAt: '2023-09-15',
                visits: 128,
                active: true
            },
            {
                id: 'link_002',
                url: 'https://cs.example.com/link/def456',
                createdAt: '2023-10-02',
                visits: 75,
                active: true
            },
            {
                id: 'link_003',
                url: 'https://cs.example.com/link/ghi789',
                createdAt: '2023-11-12',
                visits: 42,
                active: false
            }
        ];

        setShareLinks(mockLinks);
    }, []);

    // 生成新链接
    const handleGenerateLink = () => {
        if (!canManageLinks) {
            Alert.alert('权限不足', '您没有管理分享链接的权限');
            return;
        }

        setIsGenerating(true);

        // 模拟API调用延迟
        setTimeout(() => {
            const linkId = nanoid(10);
            const newLink: ShareLink = {
                id: `link_${Date.now()}`,
                url: `https://cs.example.com/link/${linkId}`,
                createdAt: new Date().toISOString().split('T')[0],
                visits: 0,
                active: true
            };

            setShareLinks([newLink, ...shareLinks]);
            setIsGenerating(false);
            Alert.alert('成功', '新的分享链接已生成');
        }, 1000);
    };

    // 复制链接到剪贴板
    const handleCopyLink = async (url: string) => {
        try {
            await Clipboard.setStringAsync(url);
            Alert.alert('复制成功', '链接已复制到剪贴板');
        } catch (error) {
            console.error('复制链接失败:', error);
            Alert.alert('错误', '复制链接失败，请手动复制');
        }
    };

    // 复制二维码
    const handleCopyQRCode = async (linkId: string) => {
        try {
            // 实际应用中应该生成二维码或获取二维码图片URL
            await Clipboard.setStringAsync(`二维码数据: ${linkId}`);
            Alert.alert('成功', '二维码数据已复制（实际应用中应提供二维码图片）');
        } catch (error) {
            console.error('复制二维码失败:', error);
            Alert.alert('错误', '复制二维码失败');
        }
    };

    // 停用链接
    const handleDeactivateLink = (linkId: string) => {
        if (!canManageLinks) {
            Alert.alert('权限不足', '您没有管理分享链接的权限');
            return;
        }

        Alert.alert(
            '确认操作',
            '确定要停用此分享链接吗？已分享的链接将无法访问。',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '确定',
                    onPress: () => {
                        setShareLinks(shareLinks.map(link =>
                            link.id === linkId
                                ? { ...link, active: false }
                                : link
                        ));
                        Alert.alert('成功', '链接已停用');
                    }
                }
            ]
        );
    };

    // 查看链接统计
    const handleViewStats = (linkId: string) => {
        // 在实际应用中，这里应该跳转到统计详情页面
        const link = shareLinks.find(link => link.id === linkId);
        if (link) {
            Alert.alert(
                '访问统计',
                `链接: ${link.url}\n总访问量: ${link.visits}\n创建日期: ${link.createdAt}\n状态: ${link.active ? '活跃' : '已停用'}`
            );
        }
    };

    // 渲染链接项
    const renderLinkItem = ({ item }: { item: ShareLink }) => (
        <View style={styles.linkItem}>
            <View style={styles.linkContent}>
                <Text style={styles.linkUrl} numberOfLines={1} ellipsizeMode="middle">
                    {item.url}
                </Text>
                <Text style={styles.linkStats}>
                    访问量: {item.visits} · 创建于: {item.createdAt}
                </Text>
                <View style={styles.linkStatus}>
                    <View style={[styles.statusIndicator, { backgroundColor: item.active ? COLORS.success : COLORS.danger }]} />
                    <Text style={styles.statusText}>
                        {item.active ? '活跃' : '已停用'}
                    </Text>
                </View>
            </View>

            <View style={styles.linkActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCopyLink(item.url)}
                >
                    <Copy size={16} color={COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCopyQRCode(item.id)}
                >
                    <QrCode size={16} color={COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewStats(item.id)}
                >
                    <BarChart2 size={16} color={COLORS.primary} />
                </TouchableOpacity>

                {item.active && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeactivateLink(item.id)}
                        disabled={!canManageLinks}
                    >
                        <XCircle size={16} color={canManageLinks ? COLORS.danger : COLORS.gray} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: '分享链接',
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <ArrowLeft size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    )
                }}
            />

            <View style={styles.header}>
                <Text style={styles.title}>分享链接管理</Text>
                <TouchableOpacity
                    style={[
                        styles.generateButton,
                        (!canManageLinks || isGenerating) && styles.disabledButton
                    ]}
                    onPress={handleGenerateLink}
                    disabled={isGenerating || !canManageLinks}
                >
                    {isGenerating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Plus size={16} color="#FFFFFF" />
                            <Text style={styles.generateButtonText}>生成新链接</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {shareLinks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Link size={40} color={COLORS.gray} />
                        <Text style={styles.emptyText}>
                            暂无分享链接
                        </Text>
                        {canManageLinks && (
                            <Text style={styles.emptySubtext}>
                                点击上方按钮生成新的分享链接
                            </Text>
                        )}
                    </View>
                ) : (
                    <FlatList
                        data={shareLinks}
                        keyExtractor={(item: ShareLink) => item.id}
                        renderItem={renderLinkItem}
                        contentContainerStyle={styles.linksList}
                    />
                )}
            </View>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    generateButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 8,
    },
    disabledButton: {
        backgroundColor: COLORS.gray,
    },
    generateButtonText: {
        color: COLORS.white,
        marginLeft: 8,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        color: COLORS.text,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
    },
    linksList: {
        padding: 16,
    },
    linkItem: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    linkContent: {
        flex: 1,
    },
    linkUrl: {
        fontSize: 16,
        marginBottom: 8,
        color: COLORS.text,
    },
    linkStats: {
        fontSize: 14,
        color: COLORS.gray,
    },
    linkStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
    },
    linkActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
    },
}); 