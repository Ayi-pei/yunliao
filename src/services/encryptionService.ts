/**
 * 加密服务
 * 提供消息加密和解密功能，确保通信安全
 */

import { nanoid } from 'nanoid';
// @ts-ignore - 这里使用一个假设的加密库，实际项目中应使用真实的加密库如CryptoJS
import * as SecureStore from '../adapters/SecureStoreBridge';

// 密钥存储常量
const ENCRYPTION_KEY_STORE = 'encryptionKey';
const ENCRYPTION_IV_STORE = 'encryptionIV';

// 加密模式
export enum EncryptionMode {
    NONE = 'none',
    AES = 'aes',
    E2E = 'e2e' // 端到端加密
}

// 当前加密模式
let currentMode: EncryptionMode = EncryptionMode.NONE;

/**
 * 初始化加密服务
 * @param mode 加密模式
 */
export const initEncryptionService = async (mode: EncryptionMode = EncryptionMode.AES): Promise<void> => {
    try {
        currentMode = mode;

        if (mode === EncryptionMode.NONE) {
            return;
        }

        // 检查是否已有密钥
        const existingKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORE);
        const existingIV = await SecureStore.getItemAsync(ENCRYPTION_IV_STORE);

        if (!existingKey || !existingIV) {
            // 生成新的密钥和初始化向量
            await generateNewKeys();
        }

        console.log(`加密服务已初始化，模式: ${mode}`);
    } catch (error) {
        console.error('初始化加密服务失败:', error);
        currentMode = EncryptionMode.NONE;
    }
};

/**
 * 生成新的加密密钥和初始化向量
 */
export const generateNewKeys = async (): Promise<void> => {
    try {
        // 生成随机密钥和IV
        const key = nanoid(32); // 256位密钥
        const iv = nanoid(16); // 128位IV

        // 存储密钥和IV
        await SecureStore.setItemAsync(ENCRYPTION_KEY_STORE, key);
        await SecureStore.setItemAsync(ENCRYPTION_IV_STORE, iv);

        console.log('已生成新的加密密钥和初始化向量');
    } catch (error) {
        console.error('生成加密密钥失败:', error);
        throw error;
    }
};

/**
 * 获取当前加密密钥和初始化向量
 */
const getEncryptionKeys = async (): Promise<{ key: string; iv: string } | null> => {
    try {
        const key = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORE);
        const iv = await SecureStore.getItemAsync(ENCRYPTION_IV_STORE);

        if (!key || !iv) {
            console.error('加密密钥不存在');
            return null;
        }

        return { key, iv };
    } catch (error) {
        console.error('获取加密密钥失败:', error);
        return null;
    }
};

/**
 * 加密消息
 * @param data 要加密的数据
 * @returns 加密后的数据
 */
export const encryptData = async (data: any): Promise<string | null> => {
    try {
        // 如果未启用加密，直接返回原始数据的字符串形式
        if (currentMode === EncryptionMode.NONE) {
            return JSON.stringify(data);
        }

        const keys = await getEncryptionKeys();
        if (!keys) {
            throw new Error('加密密钥不可用');
        }

        // 这里是简化的加密逻辑，实际应用中应使用真实的加密算法
        // 在实际项目中，应使用如CryptoJS的AES加密或其他加密库
        const jsonData = JSON.stringify(data);

        // 模拟加密过程
        // 注意：这不是真正的加密，只是一个示例
        const encryptedData = Buffer.from(jsonData).toString('base64');

        return encryptedData;
    } catch (error) {
        console.error('加密数据失败:', error);
        return null;
    }
};

/**
 * 解密消息
 * @param encryptedData 加密的数据
 * @returns 解密后的数据
 */
export const decryptData = async (encryptedData: string): Promise<any | null> => {
    try {
        // 如果未启用加密，尝试直接解析JSON
        if (currentMode === EncryptionMode.NONE) {
            return JSON.parse(encryptedData);
        }

        const keys = await getEncryptionKeys();
        if (!keys) {
            throw new Error('加密密钥不可用');
        }

        // 这里是简化的解密逻辑，实际应用中应使用真实的解密算法
        // 模拟解密过程
        // 注意：这不是真正的解密，只是一个示例
        const jsonData = Buffer.from(encryptedData, 'base64').toString();

        return JSON.parse(jsonData);
    } catch (error) {
        console.error('解密数据失败:', error);
        return null;
    }
};

/**
 * 获取当前加密模式
 */
export const getCurrentEncryptionMode = (): EncryptionMode => {
    return currentMode;
};

/**
 * 设置加密模式
 * @param mode 加密模式
 */
export const setEncryptionMode = async (mode: EncryptionMode): Promise<void> => {
    try {
        if (mode !== currentMode) {
            await initEncryptionService(mode);
        }
    } catch (error) {
        console.error('设置加密模式失败:', error);
        throw error;
    }
};