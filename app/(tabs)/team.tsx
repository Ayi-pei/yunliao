import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
// @ts-ignore
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/contexts/AuthContext';
import { AgentData, AgentStatus } from '@/src/types';
import { Permission } from '@/src/types/auth';
import { useRouter } from 'expo-router';
import { ArrowLeft, Edit, Plus, Trash2, X } from 'lucide-react-native';

// 模拟团队成员数据
const mockTeamMembers: AgentData[] = [
    {
        id: 'agent_001',
        name: '张明',
        status: AgentStatus.ONLINE,
        email: 'zhang@example.com',
        activeChats: 3,
        totalResolved: 145,
        permissions: ['chat', 'view_customers'],
    },
    {
        id: 'agent_002',
        name: '王丽',
        status: AgentStatus.BUSY,
        email: 'wang@example.com',
        activeChats: 5,
        totalResolved: 289,
        permissions: ['chat', 'view_customers', 'view_analytics'],
    },
    {
        id: 'agent_003',
        name: '李强',
        status: AgentStatus.OFFLINE,
        email: 'li@example.com',
        activeChats: 0,
        totalResolved: 167,
        permissions: ['chat', 'view_customers'],
    },
];

// 创建一个映射用于标识培训中的客服
const traineeAgents = new Set(['agent_003']);

export default function TeamManagementScreen() {
    const router = useRouter();
    const { agent } = useAuth();
    const [teamMembers, setTeamMembers] = useState<AgentData[]>(mockTeamMembers);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMemberId, setEditMemberId] = useState<string | null>(null);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberName, setNewMemberName] = useState('');
    const [isTrainee, setIsTrainee] = useState(false);

    // 检查当前用户是否有管理员权限
    const isAdmin = agent?.permissions.includes(Permission.MANAGE_AGENTS) || false;

    useEffect(() => {
        // 如果用户没有管理权限，返回设置页面
        if (!isAdmin) {
            Alert.alert('权限不足', '您没有管理团队的权限');
            router.back();
        }
    }, [isAdmin, router]);

    // 添加新成员
    const handleAddMember = () => {
        if (!newMemberEmail.trim() || !newMemberName.trim()) {
            Alert.alert('输入错误', '请输入邮箱和姓名');
            return;
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newMemberEmail)) {
            Alert.alert('输入错误', '请输入有效的邮箱地址');
            return;
        }

        const newMember: AgentData = {
            id: `agent_${Date.now()}`,
            name: newMemberName,
            email: newMemberEmail,
            avatar: undefined, // 改为undefined而不是null
            status: AgentStatus.OFFLINE, // 使用AgentStatus枚举
            permissions: isTrainee
                ? ['send_messages', 'use_quick_replies']
                : ['send_messages', 'upload_files', 'use_quick_replies', 'close_sessions'],
            activeChats: 0,
            totalResolved: 0
        };

        const updatedMembers = [...teamMembers, newMember];
        setTeamMembers(updatedMembers);

        // 如果是培训中的客服，添加到traineeAgents集合中
        if (isTrainee) {
            traineeAgents.add(newMember.id);
        }

        setNewMemberEmail('');
        setNewMemberName('');
        setIsTrainee(false);
        setShowAddForm(false);

        Alert.alert('成功', `已添加${isTrainee ? '培训中客服' : '客服'}: ${newMemberName}`);
    };

    // 更新成员权限
    const updateMemberPermission = (memberId: string, permission: string, value: boolean) => {
        setTeamMembers(members =>
            members.map(member => {
                if (member.id === memberId) {
                    const permissions = [...member.permissions];
                    if (value && !permissions.includes(permission)) {
                        permissions.push(permission);
                    } else if (!value && permissions.includes(permission)) {
                        const index = permissions.indexOf(permission);
                        permissions.splice(index, 1);
                    }
                    return { ...member, permissions };
                }
                return member;
            })
        );
    };

    // 删除成员
    const deleteMember = (memberId: string) => {
        Alert.alert(
            '确认删除',
            '确定要删除此成员吗？此操作不可撤销。',
            [
                {
                    text: '取消',
                    style: 'cancel'
                },
                {
                    text: '删除',
                    style: 'destructive',
                    onPress: () => {
                        setTeamMembers(members => members.filter(m => m.id !== memberId));
                        if (editMemberId === memberId) {
                            setEditMemberId(null);
                        }
                        // 从培训集合中移除
                        traineeAgents.delete(memberId);
                    }
                }
            ]
        );
    };

    // 检查是否为培训中的客服
    const isTraineeAgent = (agentId: string): boolean => {
        return traineeAgents.has(agentId);
    };

    // 渲染权限开关
    const renderPermissionSwitch = (
        label: string,
        permission: string,
        memberId: string | null,
        checked: boolean,
        onChange: (value: boolean) => void
    ) => (
        <View style={styles.permissionItem}>
            <Text style={styles.permissionLabel}>{label}</Text>
            <Switch
                value={checked}
                onValueChange={onChange}
                trackColor={{ false: COLORS.gray5, true: COLORS.primary }}
                thumbColor={COLORS.white}
                disabled={!memberId}
            />
        </View>
    );

    // 检查成员是否有指定权限
    const hasPermission = (memberId: string, permission: string): boolean => {
        const member = teamMembers.find(m => m.id === memberId);
        return member ? member.permissions.includes(permission) : false;
    };

    if (!isAdmin) {
        return null; // 权限检查时不渲染内容
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>团队管理</Text>
            </View>

            {/* 添加新成员按钮 */}
            {!showAddForm && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddForm(true)}
                >
                    <Plus size={20} color={COLORS.white} />
                    <Text style={styles.addButtonText}>添加新成员</Text>
                </TouchableOpacity>
            )}

            {/* 添加成员表单 */}
            <Modal
                isVisible={showAddForm}
                onBackdropPress={() => setShowAddForm(false)}
                onBackButtonPress={() => setShowAddForm(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>添加新成员</Text>
                        <TouchableOpacity
                            onPress={() => setShowAddForm(false)}
                            style={styles.closeButton}
                        >
                            <X size={20} color={COLORS.gray} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>姓名</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="输入姓名"
                            value={newMemberName}
                            onChangeText={setNewMemberName}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>邮箱</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="输入邮箱"
                            value={newMemberEmail}
                            onChangeText={setNewMemberEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>培训中客服</Text>
                            <Switch
                                value={isTrainee}
                                onValueChange={setIsTrainee}
                                trackColor={{ false: COLORS.gray5, true: COLORS.primary }}
                                thumbColor={COLORS.white}
                            />
                        </View>
                        <Text style={styles.switchDescription}>
                            培训中客服只有基本的消息发送权限
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, (!newMemberEmail.trim() || !newMemberName.trim()) && styles.disabledButton]}
                        onPress={handleAddMember}
                        disabled={!newMemberEmail.trim() || !newMemberName.trim()}
                    >
                        <Text style={styles.submitButtonText}>添加</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* 团队成员列表 */}
            <Text style={styles.sectionTitle}>团队成员 ({teamMembers.length})</Text>

            {teamMembers.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                    <View style={styles.memberHeader}>
                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <Text style={styles.memberEmail}>{member.email}</Text>
                            <Text style={styles.memberId}>ID: {member.id}</Text>
                        </View>

                        <View style={styles.memberActions}>
                            <TouchableOpacity
                                style={styles.memberAction}
                                onPress={() => setEditMemberId(editMemberId === member.id ? null : member.id)}
                            >
                                <Edit size={20} color="#007AFF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.memberAction}
                                onPress={() => deleteMember(member.id)}
                            >
                                <Trash2 size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {editMemberId === member.id && (
                        <View style={styles.permissionsContainer}>
                            <Text style={styles.permissionsTitle}>权限管理</Text>

                            {renderPermissionSwitch(
                                '发送消息',
                                'send_messages',
                                member.id,
                                hasPermission(member.id, 'send_messages'),
                                (value) => updateMemberPermission(member.id, 'send_messages', value)
                            )}

                            {renderPermissionSwitch(
                                '上传文件',
                                'upload_files',
                                member.id,
                                hasPermission(member.id, 'upload_files'),
                                (value) => updateMemberPermission(member.id, 'upload_files', value)
                            )}

                            {renderPermissionSwitch(
                                '使用快捷回复',
                                'use_quick_replies',
                                member.id,
                                hasPermission(member.id, 'use_quick_replies'),
                                (value) => updateMemberPermission(member.id, 'use_quick_replies', value)
                            )}

                            {renderPermissionSwitch(
                                '关闭会话',
                                'close_sessions',
                                member.id,
                                hasPermission(member.id, 'close_sessions'),
                                (value) => updateMemberPermission(member.id, 'close_sessions', value)
                            )}

                            {!isTraineeAgent(member.id) && renderPermissionSwitch(
                                '查看分析数据',
                                'view_analytics',
                                member.id,
                                hasPermission(member.id, 'view_analytics'),
                                (value) => updateMemberPermission(member.id, 'view_analytics', value)
                            )}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5856D6',
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 20,
    },
    addButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
        marginTop: 16,
        marginBottom: 12,
    },
    memberCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        margin: 8,
        ...(Platform.OS === 'web' ? {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        } : {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        }),
        elevation: 2,
    },
    memberHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
        marginBottom: 4,
    },
    memberEmail: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#8E8E93',
        marginBottom: 4,
    },
    memberId: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#8E8E93',
    },
    memberActions: {
        flexDirection: 'row',
    },
    memberAction: {
        marginLeft: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionsContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    permissionsTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
        marginBottom: 12,
    },
    permissionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    permissionLabel: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#000000',
    },
    modalContainer: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
    },
    closeButton: {
        padding: 8,
    },
    formGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#8E8E93',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#8E8E93',
        marginRight: 8,
    },
    switchDescription: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#8E8E93',
    },
    submitButton: {
        backgroundColor: '#5856D6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#F2F2F7',
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#FFFFFF',
    },
}); 