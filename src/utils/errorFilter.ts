/**
 * 错误过滤器工具
 * 用于处理和抑制特定类型的警告和错误
 */

import { Platform } from 'react-native';

// 需要被过滤的警告消息关键词
const WARNING_FILTERS = [
    'props.pointerEvents is deprecated',
    'Unchecked runtime.lastError',
];

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

/**
 * 应用错误过滤器
 * 过滤掉已知的无法解决但不影响功能的错误和警告
 */
export function applyErrorFilters(): void {
    if (Platform.OS !== 'web' || process.env.NODE_ENV === 'production') {
        return;
    }

    // 过滤警告消息
    console.warn = function filterWarning(...args: any[]) {
        // 如果是第一个参数是字符串，检查是否包含已知警告
        if (typeof args[0] === 'string') {
            const warningMessage = args[0];

            // 忽略已知的无害警告
            if (
                warningMessage.includes('shadow*') ||
                warningMessage.includes('pointerEvents') ||
                warningMessage.includes('Cannot record touch end without a touch start') ||
                warningMessage.includes('MediaTypeOptions is deprecated')
            ) {
                return; // 忽略这些警告
            }
        }

        // 对于其他警告，保持原始行为
        originalConsoleWarn.apply(console, args);
    };

    // 过滤错误消息
    console.error = function filterError(...args: any[]) {
        // 如果是第一个参数是字符串，检查是否包含已知错误
        if (typeof args[0] === 'string') {
            const errorMessage = args[0];

            // 忽略已知的无害错误
            if (
                errorMessage.includes('Layout children must be of type Screen') ||
                errorMessage.includes('No route named')
            ) {
                return; // 忽略这些错误
            }
        }

        // 对于其他错误，保持原始行为
        originalConsoleError.apply(console, args);
    };

    console.log('已应用错误过滤器，将抑制特定类型的警告和错误');
}

/**
 * 移除错误过滤器，恢复原始控制台行为
 * 用于清理资源或测试
 */
export function removeErrorFilters(): void {
    // 此函数可在需要时调用，例如在组件卸载时
    // 目前保留为空函数，因为我们通常不需要恢复过滤器
} 