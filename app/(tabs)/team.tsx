import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Platform } from 'react-native';
// @ts-ignore
import { useRouter } from 'expo-router';
import { Users, UserPlus, Edit, Trash2, ArrowLeft, Shield } from 'lucide-react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { AgentData, AgentStatus } from '@/src/types';

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

export default function TeamManagementScreen() {
    const router = useRouter();
    const { agent } = useAuth();
    const [teamMembers, setTeamMembers] = useState<AgentData[]>(mockTeamMembers);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMemberId, setEditMemberId] = useState<string | null>(null);
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        permissions: {
            chat: true,
            view_customers: true,
            view_analytics: false,
            manage_agents: false,
            system_config: false,
            assign_chats: false,
        },
    });

    // 检查当前用户是否有管理员权限
    const isAdmin = agent?.permissions.includes('manage_agents') || false;

    useEffect(() => {
        // 如果用户没有管理权限，返回设置页面
        if (!isAdmin) {
            Alert.alert('权限不足', '您没有管理团队的权限');
            router.back();
        }
    }, [isAdmin, router]);

    // 添加新成员
    const handleAddMember = () => {
        if (!newMember.name || !newMember.email) {
            Alert.alert('信息不完整', '请填写客服姓名和邮箱');
            return;
        }

        const permissions = Object.entries(newMember.permissions)
            .filter(([_, value]) => value)
            .map(([key]) => key);

        const newAgentId = `agent_${Math.floor(Math.random() * 1000)}`;

        const memberToAdd: AgentData = {
            id: newAgentId,
            name: newMember.name,
            email: newMember.email,
            status: AgentStatus.OFFLINE,
            activeChats: 0,
            totalResolved: 0,
            permissions: permissions,
        };

        setTeamMembers([...teamMembers, memberToAdd]);
        setNewMember({
            name: '',
            email: '',
            permissions: {
                chat: true,
                view_customers: true,
                view_analytics: false,
                manage_agents: false,
                system_config: false,
                assign_chats: false,
            },
        });
        setShowAddForm(false);
    };

    // 更新成员权限
    const updateMemberPermission = (memberId: string, permission: string, value: boolean) => {
        setTeamMembers(teamMembers.map(member => {
            if (member.id === memberId) {
                const updatedPermissions = value
                    ? [...member.permissions, permission]
                    : member.permissions.filter(p => p !== permission);

                return {
                    ...member,
                    permissions: updatedPermissions
                };
            }
            return member;
        }));
    };

    // 删除成员
    const deleteMember = (memberId: string) => {
        Alert.alert(
            '确认删除',
            '确定要删除此团队成员吗？此操作不可撤销。',
            [
                {
                    text: '取消',
                    style: 'cancel'
                },
                {
                    text: '删除',
                    onPress: () => {
                        setTeamMembers(teamMembers.filter(member => member.id !== memberId));
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    // 渲染权限设置组件
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
                trackColor={{ false: '#E5E5EA', true: '#5856D6' }}
            />
        </View>
    );

    // 获取成员是否有某权限
    const hasPermission = (memberId: string, permission: string): boolean => {
        const member = teamMembers.find(m => m.id === memberId);
        return member?.permissions.includes(permission) || false;
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
                    <UserPlus size={20} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>添加新成员</Text>
                </TouchableOpacity>
            )}

            {/* 添加成员表单 */}
            {showAddForm && (
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>添加新团队成员</Text>

                    <Text style={styles.inputLabel}>客服姓名</Text>
                    <TextInput
                        style={styles.input}
                        value={newMember.name}
                        onChangeText={(text) => setNewMember({ ...newMember, name: text })}
                        placeholder="输入客服姓名"
                    />

                    <Text style={styles.inputLabel}>邮箱</Text>
                    <TextInput
                        style={styles.input}
                        value={newMember.email}
                        onChangeText={(text) => setNewMember({ ...newMember, email: text })}
                        placeholder="输入邮箱地址"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.sectionTitle}>权限设置</Text>

                    {renderPermissionSwitch(
                        '聊天功能',
                        'chat',
                        null,
                        newMember.permissions.chat,
                        (value) => setNewMember({
                            ...newMember,
                            permissions: { ...newMember.permissions, chat: value }
                        })
                    )}

                    {renderPermissionSwitch(
                        '查看客户',
                        'view_customers',
                        null,
                        newMember.permissions.view_customers,
                        (value) => setNewMember({
                            ...newMember,
                            permissions: { ...newMember.permissions, view_customers: value }
                        })
                    )}

                    {renderPermissionSwitch(
                        '查看分析',
                        'view_analytics',
                        null,
                        newMember.permissions.view_analytics,
                        (value) => setNewMember({
                            ...newMember,
                            permissions: { ...newMember.permissions, view_analytics: value }
                        })
                    )}

                    {renderPermissionSwitch(
                        '管理团队',
                        'manage_agents',
                        null,
                        newMember.permissions.manage_agents,
                        (value) => setNewMember({
                            ...newMember,
                            permissions: { ...newMember.permissions, manage_agents: value }
                        })
                    )}

                    {renderPermissionSwitch(
                        '系统配置',
                        'system_config',
                        null,
                        newMember.permissions.system_config,
                        (value) => setNewMember({
                            ...newMember,
                            permissions: { ...newMember.permissions, system_config: value }
                        })
                    )}

                    {renderPermissionSwitch(
                        '分配会话',
                        'assign_chats',
                        null,
                        newMember.permissions.assign_chats,
                        (value) => setNewMember({
                            ...newMember,
                            permissions: { ...newMember.permissions, assign_chats: value }
                        })
                    )}

                    <View style={styles.formActions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => {
                                setShowAddForm(false);
                                setNewMember({
                                    name: '',
                                    email: '',
                                    permissions: {
                                        chat: true,
                                        view_customers: true,
                                        view_analytics: false,
                                        manage_agents: false,
                                        system_config: false,
                                        assign_chats: false,
                                    },
                                });
                            }}
                        >
                            <Text style={styles.cancelButtonText}>取消</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleAddMember}
                        >
                            <Text style={styles.saveButtonText}>添加</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

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
                                '聊天功能',
                                'chat',
                                member.id,
                                hasPermission(member.id, 'chat'),
                                (value) => updateMemberPermission(member.id, 'chat', value)
                            )}

                            {renderPermissionSwitch(
                                '查看客户',
                                'view_customers',
                                member.id,
                                hasPermission(member.id, 'view_customers'),
                                (value) => updateMemberPermission(member.id, 'view_customers', value)
                            )}

                            {renderPermissionSwitch(
                                '查看分析',
                                'view_analytics',
                                member.id,
                                hasPermission(member.id, 'view_analytics'),
                                (value) => updateMemberPermission(member.id, 'view_analytics', value)
                            )}

                            {renderPermissionSwitch(
                                '管理团队',
                                'manage_agents',
                                member.id,
                                hasPermission(member.id, 'manage_agents'),
                                (value) => updateMemberPermission(member.id, 'manage_agents', value)
                            )}

                            {renderPermissionSwitch(
                                '系统配置',
                                'system_config',
                                member.id,
                                hasPermission(member.id, 'system_config'),
                                (value) => updateMemberPermission(member.id, 'system_config', value)
                            )}

                            {renderPermissionSwitch(
                                '分配会话',
                                'assign_chats',
                                member.id,
                                hasPermission(member.id, 'assign_chats'),
                                (value) => updateMemberPermission(member.id, 'assign_chats', value)
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
    formContainer: {
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
    formTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#000000',
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
        marginBottom: 16,
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F2F2F7',
        marginRight: 12,
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#8E8E93',
    },
    saveButton: {
        backgroundColor: '#5856D6',
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#FFFFFF',
    },
}); 