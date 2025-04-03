"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var expo_router_1 = require("expo-router");
var react_native_1 = require("react-native");
var AuthContext_1 = require("../../contexts/AuthContext");
/**
 * 身份验证守卫组件
 * 根据用户认证状态重定向到适当的页面
 */
var AuthGuard = function (_a) {
    var children = _a.children;
    var _b = (0, AuthContext_1.useAuth)(), isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading;
    var segments = (0, expo_router_1.useSegments)();
    var router = (0, expo_router_1.useRouter)();
    (0, react_1.useEffect)(function () {
        // 如果认证加载中，不执行任何操作
        if (isLoading)
            return;
        // 获取当前路径的第一个段，判断是否在认证路由内
        var inAuthGroup = segments[0] === '(auth)';
        // 根据认证状态和当前路径决定重定向
        if (!isAuthenticated && !inAuthGroup) {
            // 用户未认证且不在认证路由内，重定向到登录页面
            router.replace('/(auth)/login');
        }
        else if (isAuthenticated && inAuthGroup) {
            // 用户已认证但在认证路由内，重定向到主页
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, isLoading, segments, router]);
    // 如果认证状态正在加载，显示加载指示器
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.loadingContainer, children: (0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { size: "large", color: "#007AFF" }) }));
    }
    // 渲染子组件
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
var styles = react_native_1.StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
});
exports.default = AuthGuard;
