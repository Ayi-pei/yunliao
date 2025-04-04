import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Camera, User, X } from 'lucide-react-native';

export default function ProfileEditScreen() {
    const router = useRouter();
    const { agent, updateProfile } = useAuth();

    const [name, setName] = useState(agent?.displayName || '');
    const [avatarUri, setAvatarUri] = useState<string | undefined>(agent?.avatar);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // 请求相册访问权限
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('权限不足', '需要相册访问权限来选择头像图片');
            }
        })();
    }, []);

    // 选择头像图片
    const pickImage = async () => {
        try {
            setIsLoading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('选择图片时出错:', error);
            Alert.alert('错误', '选择图片时出错，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 清除头像
    const clearAvatar = () => {
        setAvatarUri(undefined);
    };

    // 保存个人资料
    const handleSaveProfile = async () => {
        if (!name.trim()) {
            Alert.alert('提示', '昵称不能为空');
            return;
        }

        if (name === agent?.displayName && avatarUri === agent?.avatar) {
            Alert.alert('提示', '未做任何修改');
            return;
        }

        setIsSaving(true);
        try {
            // 调用 updateProfile 方法更新个人资料
            const success = await updateProfile({
                name: name,
                avatar: avatarUri
            });

            if (success) {
                Alert.alert('成功', '个人资料已更新', [
                    { text: '确定', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('错误', '更新个人资料失败，请重试');
            }
        } catch (error) {
            console.error('保存个人资料时出错:', error);
            Alert.alert('错误', '保存个人资料时出错，请重试');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: '编辑个人资料',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        {avatarUri ? (
                            <>
                                <Image source={{ uri: avatarUri }} style={styles.avatar} />
                                <TouchableOpacity style={styles.clearAvatarButton} onPress={clearAvatar}>
                                    <X size={16} color="#FFFFFF" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.placeholderAvatar}>
                                <User size={40} color="#FFFFFF" />
                            </View>
                        )}

                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
                        )}
                    </View>

                    <TouchableOpacity style={styles.changeAvatarButton} onPress={pickImage} disabled={isLoading}>
                        <Camera size={16} color="#FFFFFF" />
                        <Text style={styles.changeAvatarText}>更换头像</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>客服昵称</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="请输入您的昵称"
                        maxLength={20}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>客服ID</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledText}>{agent?.id || '未知'}</Text>
                    </View>
                    <Text style={styles.hint}>客服ID不可修改</Text>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                    onPress={handleSaveProfile}
                    disabled={isSaving || !name.trim() || (name === agent?.displayName && avatarUri === agent?.avatar)}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>保存</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
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
    content: {
        padding: 16,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 16,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray5,
        marginBottom: 12,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholderAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearAvatarButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: COLORS.danger,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeAvatarButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    changeAvatarText: {
        color: COLORS.white,
        marginLeft: 8,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: COLORS.text,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: COLORS.white,
    },
    disabledInput: {
        borderWidth: 1,
        borderColor: COLORS.gray5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: COLORS.gray5,
    },
    disabledText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    hint: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonDisabled: {
        backgroundColor: COLORS.gray,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
}); 