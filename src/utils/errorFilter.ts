/**
 * 错误和警告过滤工具
 * 用于过滤和抑制特定类型的错误消息
 */

import { Platform } from 'react-native';

// 需要被过滤的警告消息关键词
const WARNING_FILTERS = [
    'props.pointerEvents is deprecated',
    'Unchecked runtime.lastError',
];

/**
 * 应用错误过滤器，抑制特定类型的错误和警告
 * 仅在开发环境下运行
 */
export function applyErrorFilters(): void {
    if (Platform.OS !== 'web' || process.env.NODE_ENV === 'production') {
        return;
    }

    // 保存原始控制台方法
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    // 覆盖console.warn以过滤掉特定警告
    console.warn = (...args: any[]) => {
        // 检查是否为需要过滤的警告消息
        const message = String(args[0] || '');
        if (WARNING_FILTERS.some(filter => message.includes(filter))) {
            return; // 过滤掉匹配的警告
        }

        // 调用原始方法显示其他警告
        originalConsoleWarn.apply(console, args);
    };

    // 覆盖console.error以过滤掉特定错误
    console.error = (...args: any[]) => {
        // 检查是否为需要过滤的错误消息
        const message = String(args[0] || '');
        if (WARNING_FILTERS.some(filter => message.includes(filter))) {
            return; // 过滤掉匹配的错误
        }

        // 调用原始方法显示其他错误
        originalConsoleError.apply(console, args);
    };
}

/**
 * 移除错误过滤器，恢复原始控制台行为
 * 用于清理资源或测试
 */
export function removeErrorFilters(): void {
    // 此函数可在需要时调用，例如在组件卸载时
    // 目前保留为空函数，因为我们通常不需要恢复过滤器
} 