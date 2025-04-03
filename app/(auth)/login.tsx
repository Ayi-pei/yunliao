import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
// @ts-ignore
import { useRouter } from 'expo-router';
import { Lock, UserCheck, Key } from 'lucide-react-native';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [errors, setErrors] = useState({
    agentId: '',
    agentName: '',
    apiKey: ''
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      agentId: '',
      agentName: '',
      apiKey: ''
    };

    if (!agentId.trim()) {
      newErrors.agentId = '请输入客服ID';
      isValid = false;
    }

    if (!agentName.trim()) {
      newErrors.agentName = '请输入您的姓名';
      isValid = false;
    }

    if (!apiKey.trim()) {
      newErrors.apiKey = '请输入有效的API密钥';
      isValid = false;
    } else if (apiKey.length < 10) {
      newErrors.apiKey = 'API密钥长度不足';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const success = await login(agentId, agentName, apiKey);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('登录失败', '无效的凭据，请检查您的客服ID和API密钥');
      }
    } catch (error) {
      Alert.alert('登录错误', '登录过程中发生错误，请稍后重试');
      console.error('登录错误:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.formContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>客服登录</Text>
          <Text style={styles.headerSubtitle}>请使用您的客服ID和API密钥登录</Text>
        </View>

        <View style={styles.inputContainer}>
          <UserCheck size={20} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="客服ID"
            value={agentId}
            onChangeText={setAgentId}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.agentId ? <Text style={styles.errorText}>{errors.agentId}</Text> : null}

        <View style={styles.inputContainer}>
          <UserCheck size={20} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="您的姓名"
            value={agentName}
            onChangeText={setAgentName}
            autoCorrect={false}
          />
        </View>
        {errors.agentName ? <Text style={styles.errorText}>{errors.agentName}</Text> : null}

        <View style={styles.inputContainer}>
          <Key size={20} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="API密钥"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.apiKey ? <Text style={styles.errorText}>{errors.apiKey}</Text> : null}

        <TouchableOpacity
          style={[styles.loginButton, (!agentId || !agentName || !apiKey) && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading || !agentId || !agentName || !apiKey}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>登录</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Lock size={16} color="#8E8E93" />
          <Text style={styles.infoText}>
            API密钥由系统管理员分配，请妥善保管
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#000000',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 16,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  loginButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    marginLeft: 8,
    textAlign: 'center',
  },
}); 