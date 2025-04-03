/**
 * expo-secure-store API适配层
 * 该模块提供兼容层，允许应用程序代码使用一致的API，
 * 而不受底层expo-secure-store版本变化的影响
 */

// 导入方式修改，确保获取正确的模块
// @ts-ignore
import * as SecureStoreModule from 'expo-secure-store';

// Web环境检测
const isWeb = typeof document !== 'undefined';

// 重新导出一个安全的、不含弃用警告的API子集

/**
 * 存储键值对
 */
export async function setItemAsync(
  key: string,
  value: string,
  options = {}
): Promise<void> {
  try {
    // 在Web环境中使用localStorage作为备选
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }

    // 使用当前版本API（14.0.1+）
    if (typeof SecureStoreModule.setItemAsync === 'function') {
      return await SecureStoreModule.setItemAsync(key, value, options);
    }

    // 尝试直接访问内部实现（兼容性尝试）
    const module = SecureStoreModule as any;

    if (module.default && typeof module.default.setItemAsync === 'function') {
      return await module.default.setItemAsync(key, value, options);
    }

    if (module.default && typeof module.default.setValueWithKeyAsync === 'function') {
      return await module.default.setValueWithKeyAsync(value, key, options);
    }

    // 最后的备选方案
    console.warn('SecureStore API不可用: setItemAsync - 使用localStorage作为备选');
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('SecureStore setItemAsync 错误:', error);
    // 在出错时使用后备方案
    try {
      localStorage.setItem(key, value);
    } catch (fallbackError) {
      console.error('后备存储也失败了:', fallbackError);
    }
  }
}

/**
 * 获取存储的值
 */
export async function getItemAsync(
  key: string,
  options = {}
): Promise<string | null> {
  try {
    // 在Web环境中使用localStorage作为备选
    if (isWeb) {
      return localStorage.getItem(key);
    }

    // 使用当前版本API（14.0.1+）
    if (typeof SecureStoreModule.getItemAsync === 'function') {
      return await SecureStoreModule.getItemAsync(key, options);
    }

    // 尝试直接访问内部实现（兼容性尝试）
    const module = SecureStoreModule as any;

    if (module.default && typeof module.default.getItemAsync === 'function') {
      return await module.default.getItemAsync(key, options);
    }

    if (module.default && typeof module.default.getValueWithKeyAsync === 'function') {
      return await module.default.getValueWithKeyAsync(key, options);
    }

    // 最后的备选方案
    console.warn('SecureStore API不可用: getItemAsync - 使用localStorage作为备选');
    return localStorage.getItem(key);
  } catch (error) {
    console.error('SecureStore getItemAsync 错误:', error);
    // 在出错时使用后备方案
    try {
      return localStorage.getItem(key);
    } catch (fallbackError) {
      console.error('后备存储也失败了:', fallbackError);
      return null;
    }
  }
}

/**
 * 删除存储的值
 */
export async function deleteItemAsync(
  key: string,
  options = {}
): Promise<void> {
  try {
    // 在Web环境中使用localStorage作为备选
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }

    // 使用当前版本API（14.0.1+）
    if (typeof SecureStoreModule.deleteItemAsync === 'function') {
      return await SecureStoreModule.deleteItemAsync(key, options);
    }

    // 尝试直接访问内部实现（兼容性尝试）
    const module = SecureStoreModule as any;

    if (module.default && typeof module.default.deleteItemAsync === 'function') {
      return await module.default.deleteItemAsync(key, options);
    }

    if (module.default && typeof module.default.deleteValueWithKeyAsync === 'function') {
      return await module.default.deleteValueWithKeyAsync(key, options);
    }

    // 最后的备选方案
    console.warn('SecureStore API不可用: deleteItemAsync - 使用localStorage作为备选');
    localStorage.removeItem(key);
  } catch (error) {
    console.error('SecureStore deleteItemAsync 错误:', error);
    // 在出错时使用后备方案
    try {
      localStorage.removeItem(key);
    } catch (fallbackError) {
      console.error('后备存储也失败了:', fallbackError);
    }
  }
}

/**
 * 检查SecureStore是否可用
 */
export async function isAvailableAsync(): Promise<boolean> {
  try {
    // 在Web环境中，返回false（表示需要使用后备方案）
    if (isWeb) {
      return false;
    }

    if (typeof SecureStoreModule.isAvailableAsync === 'function') {
      return await SecureStoreModule.isAvailableAsync();
    }

    // 检查是否有任何一个关键方法可用
    const module = SecureStoreModule as any;
    return !!(
      (typeof SecureStoreModule.getItemAsync === 'function') ||
      (module.default && typeof module.default.getItemAsync === 'function') ||
      (module.default && typeof module.default.getValueWithKeyAsync === 'function')
    );
  } catch (error) {
    console.error('SecureStore isAvailableAsync 错误:', error);
    return false;
  }
}

/**
 * 检查是否可以使用生物识别认证
 */
export function canUseBiometricAuthentication(): boolean {
  try {
    // @ts-ignore
    if (typeof SecureStoreModule.canUseBiometricAuthentication === 'function') {
      // @ts-ignore
      return SecureStoreModule.canUseBiometricAuthentication();
    }
    return false;
  } catch (error) {
    console.error('SecureStore canUseBiometricAuthentication 错误:', error);
    return false;
  }
}

// 导出常量 - 优先使用新版本的常量，或提供合理的默认值
export const AFTER_FIRST_UNLOCK = SecureStoreModule.AFTER_FIRST_UNLOCK || 'AfterFirstUnlock';
export const AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY = SecureStoreModule.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY || 'AfterFirstUnlockThisDeviceOnly';
export const WHEN_PASSCODE_SET_THIS_DEVICE_ONLY = SecureStoreModule.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY || 'WhenPasscodeSetThisDeviceOnly';
export const WHEN_UNLOCKED = SecureStoreModule.WHEN_UNLOCKED || 'WhenUnlocked';
export const WHEN_UNLOCKED_THIS_DEVICE_ONLY = SecureStoreModule.WHEN_UNLOCKED_THIS_DEVICE_ONLY || 'WhenUnlockedThisDeviceOnly';

// 安全替代方案 - 旧版常量映射到新的安全替代方案
export const ALWAYS = AFTER_FIRST_UNLOCK;
export const ALWAYS_THIS_DEVICE_ONLY = AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY;

// 导出类型
// @ts-ignore
export type { SecureStoreOptions } from 'expo-secure-store'; 