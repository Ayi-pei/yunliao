"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var SecureStore = __importStar(require("expo-secure-store"));
var types_1 = require("../types");
var expo_router_1 = require("expo-router");
// 创建上下文
var AuthContext = (0, react_1.createContext)(undefined);
// JWT 令牌存储键
var TOKEN_KEY = 'customer_service_auth_token';
var AGENT_DATA_KEY = 'customer_service_agent_data';
// API密钥存储键（单独存储密钥，不作为 AgentData 的一部分）
var API_KEY_STORE = 'customer_service_api_key';
// 提供者组件
function AuthProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = (0, react_1.useState)(null), agent = _b[0], setAgent = _b[1];
    var _c = (0, react_1.useState)(null), token = _c[0], setToken = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    var router = (0, expo_router_1.useRouter)();
    // 检查用户是否已认证
    var isAuthenticated = !!token && !!agent;
    // 初始化 - 检查存储的令牌和数据
    (0, react_1.useEffect)(function () {
        function loadStoredCredentials() {
            return __awaiter(this, void 0, void 0, function () {
                var storedToken, storedAgentData, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, 5, 6]);
                            return [4 /*yield*/, SecureStore.getItemAsync(TOKEN_KEY)];
                        case 1:
                            storedToken = _a.sent();
                            if (!storedToken) return [3 /*break*/, 3];
                            setToken(storedToken);
                            return [4 /*yield*/, SecureStore.getItemAsync(AGENT_DATA_KEY)];
                        case 2:
                            storedAgentData = _a.sent();
                            if (storedAgentData) {
                                setAgent(JSON.parse(storedAgentData));
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            error_1 = _a.sent();
                            console.error('加载存储的凭据时出错:', error_1);
                            return [3 /*break*/, 6];
                        case 5:
                            setIsLoading(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        loadStoredCredentials();
    }, []);
    // 登录功能
    var login = function (agentId, agentName, apiKey) { return __awaiter(_this, void 0, void 0, function () {
        var mockToken, agentData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    // 实际应用中，这里应进行API调用验证凭据
                    // 现在我们模拟成功响应，实际项目请替换为真实API调用
                    // 模拟API响应延迟
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // 实际应用中，这里应进行API调用验证凭据
                    // 现在我们模拟成功响应，实际项目请替换为真实API调用
                    // 模拟API响应延迟
                    _a.sent();
                    mockToken = "mock.jwt.token.".concat(Date.now());
                    // 存储API密钥（不作为 AgentData 的一部分）
                    return [4 /*yield*/, SecureStore.setItemAsync(API_KEY_STORE, apiKey)];
                case 3:
                    // 存储API密钥（不作为 AgentData 的一部分）
                    _a.sent();
                    agentData = {
                        id: agentId,
                        name: agentName,
                        status: types_1.AgentStatus.ONLINE,
                        avatar: undefined, // 可选头像URL
                        email: "".concat(agentId, "@example.com"), // 模拟邮箱
                        activeChats: 0,
                        totalResolved: 0,
                        permissions: ['chat', 'view_customers']
                    };
                    // 存储令牌和客服数据
                    return [4 /*yield*/, SecureStore.setItemAsync(TOKEN_KEY, mockToken)];
                case 4:
                    // 存储令牌和客服数据
                    _a.sent();
                    return [4 /*yield*/, SecureStore.setItemAsync(AGENT_DATA_KEY, JSON.stringify(agentData))];
                case 5:
                    _a.sent();
                    // 更新状态
                    setToken(mockToken);
                    setAgent(agentData);
                    return [2 /*return*/, true];
                case 6:
                    error_2 = _a.sent();
                    console.error('登录过程中出错:', error_2);
                    return [2 /*return*/, false];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // 登出功能
    var logout = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    // 清除存储的令牌和客服数据
                    return [4 /*yield*/, SecureStore.deleteItemAsync(TOKEN_KEY)];
                case 2:
                    // 清除存储的令牌和客服数据
                    _a.sent();
                    return [4 /*yield*/, SecureStore.deleteItemAsync(AGENT_DATA_KEY)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, SecureStore.deleteItemAsync(API_KEY_STORE)];
                case 4:
                    _a.sent();
                    // 重置状态
                    setToken(null);
                    setAgent(null);
                    // 导航到登录页面
                    router.replace('/(auth)/login');
                    return [3 /*break*/, 7];
                case 5:
                    error_3 = _a.sent();
                    console.error('登出过程中出错:', error_3);
                    return [3 /*break*/, 7];
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // 上下文值
    var contextValue = {
        agent: agent,
        isLoading: isLoading,
        isAuthenticated: isAuthenticated,
        login: login,
        logout: logout,
        token: token
    };
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: contextValue, children: children }));
}
// 自定义钩子用于访问上下文
function useAuth() {
    var context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth 必须在 AuthProvider 内部使用');
    }
    return context;
}
