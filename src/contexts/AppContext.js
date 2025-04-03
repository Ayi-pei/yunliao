"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProvider = AppProvider;
exports.useApp = useApp;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var types_1 = require("../types");
var types_2 = require("../types");
var AuthContext_1 = require("./AuthContext");
// 创建上下文
var AppContext = (0, react_1.createContext)(undefined);
// 模拟数据生成函数
var generateMockData = function () {
    // 生成模拟客户
    var mockCustomers = [
        {
            id: 'cust_001',
            name: '李小姐',
            email: 'customer1@example.com',
            phone: '13800138001',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            firstContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30天前
            lastContact: new Date(Date.now() - 1000 * 60 * 5), // 5分钟前
            tags: ['vip', '退款问题'],
            notes: '客户需要特殊关注',
        },
        {
            id: 'cust_002',
            name: '陈先生',
            email: 'customer2@example.com',
            phone: '13900139002',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            firstContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15天前
            lastContact: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
            tags: ['新客户'],
            notes: '',
        },
        {
            id: 'cust_003',
            name: '王女士',
            email: 'customer3@example.com',
            phone: '13700137003',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            firstContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5天前
            tags: ['商品咨询'],
        },
    ];
    // 生成模拟会话
    var mockSessions = [
        {
            id: 'sess_001',
            customerId: 'cust_001',
            agentId: 'agent_001',
            status: types_1.ChatStatus.ACTIVE,
            startTime: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
            tags: ['退款', '紧急'],
            subject: '订单退款问题',
            priority: 'high',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5分钟前
            unreadCount: 2,
        },
        {
            id: 'sess_002',
            customerId: 'cust_002',
            status: types_1.ChatStatus.PENDING,
            startTime: new Date(Date.now() - 1000 * 60 * 15), // 15分钟前
            tags: ['产品咨询'],
            subject: '关于新品上架时间',
            priority: 'medium',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15分钟前
            unreadCount: 1,
        },
        {
            id: 'sess_003',
            customerId: 'cust_003',
            agentId: 'agent_002',
            status: types_1.ChatStatus.RESOLVED,
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
            endTime: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
            tags: ['商品信息'],
            subject: '商品尺码咨询',
            priority: 'low',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
            unreadCount: 0,
        },
    ];
    // 生成模拟消息
    var mockMessages = {
        'sess_001': [
            {
                id: 'msg_001_1',
                sessionId: 'sess_001',
                senderType: 'customer',
                content: '您好，我需要申请退款，订单号是 #12345。',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
                status: 'read',
            },
            {
                id: 'msg_001_2',
                sessionId: 'sess_001',
                senderType: 'agent',
                content: '您好，李小姐。我这边会为您查询退款相关信息，请稍等。',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25分钟前
                status: 'read',
            },
            {
                id: 'msg_001_3',
                sessionId: 'sess_001',
                senderType: 'agent',
                content: '我已经查到您的订单信息，系统显示您的退款申请已经提交，正在处理中。预计1-3个工作日内会退回到您的支付账户。',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15分钟前
                status: 'read',
            },
            {
                id: 'msg_001_4',
                sessionId: 'sess_001',
                senderType: 'customer',
                content: '好的，谢谢您。我等待退款到账。如果超过3天还没收到，我再联系您。',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10分钟前
                status: 'read',
            },
            {
                id: 'msg_001_5',
                sessionId: 'sess_001',
                senderType: 'customer',
                content: '请问您能加快处理吗？我这边比较急。',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5分钟前
                status: 'delivered',
            },
        ],
        'sess_002': [
            {
                id: 'msg_002_1',
                sessionId: 'sess_002',
                senderType: 'customer',
                content: '您好，我想了解一下新款手机什么时候上架？',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15分钟前
                status: 'delivered',
            },
        ],
        'sess_003': [
            {
                id: 'msg_003_1',
                sessionId: 'sess_003',
                senderType: 'customer',
                content: '您好，我想问一下你们的T恤尺码表在哪里可以查看？',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2小时前
                status: 'read',
            },
            {
                id: 'msg_003_2',
                sessionId: 'sess_003',
                senderType: 'agent',
                content: '您好，您可以在商品详情页面下滑，有尺码指南可以参考。或者我可以为您发送尺码对照表。',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 118).toISOString(), // 118分钟前
                status: 'read',
            },
            {
                id: 'msg_003_3',
                sessionId: 'sess_003',
                senderType: 'agent',
                content: '这是我们的尺码对照表，请查收。',
                contentType: 'image',
                timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(), // 115分钟前
                status: 'read',
                attachments: [
                    {
                        url: 'https://example.com/size-chart.jpg',
                        type: 'image/jpeg',
                        name: '尺码对照表.jpg',
                        size: 245000,
                    },
                ],
            },
            {
                id: 'msg_003_4',
                sessionId: 'sess_003',
                senderType: 'customer',
                content: '谢谢，我已经看到了。我身高165cm，体重50kg，应该买M码对吗？',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // 110分钟前
                status: 'read',
            },
            {
                id: 'msg_003_5',
                sessionId: 'sess_003',
                senderType: 'agent',
                content: '是的，根据您提供的身高体重，建议您选择M码。如果您喜欢宽松一点的版型，也可以考虑L码。',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 105).toISOString(), // 105分钟前
                status: 'read',
            },
            {
                id: 'msg_003_6',
                sessionId: 'sess_003',
                senderType: 'customer',
                content: '明白了，我会选择M码的。非常感谢您的帮助！',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 100).toISOString(), // 100分钟前
                status: 'read',
            },
            {
                id: 'msg_003_7',
                sessionId: 'sess_003',
                senderType: 'agent',
                content: '不客气，如果您有其他问题，随时可以联系我们。祝您购物愉快！',
                contentType: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // 95分钟前
                status: 'read',
            },
            {
                id: 'msg_003_8',
                sessionId: 'sess_003',
                senderType: 'system',
                content: '会话已结束',
                contentType: 'system',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
                status: 'read',
            },
        ],
    };
    return { mockCustomers: mockCustomers, mockSessions: mockSessions, mockMessages: mockMessages };
};
// 提供者组件
function AppProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = (0, AuthContext_1.useAuth)(), isAuthenticated = _b.isAuthenticated, agent = _b.agent;
    var _c = (0, react_1.useState)([]), sessions = _c[0], setSessions = _c[1];
    var _d = (0, react_1.useState)([]), customers = _d[0], setCustomers = _d[1];
    var _e = (0, react_1.useState)({}), messages = _e[0], setMessages = _e[1];
    var _f = (0, react_1.useState)(true), isLoading = _f[0], setIsLoading = _f[1];
    // 加载初始数据
    (0, react_1.useEffect)(function () {
        var loadInitialData = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, mockCustomers, mockSessions, mockMessages, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isAuthenticated) {
                            setIsLoading(false);
                            return [2 /*return*/];
                        }
                        setIsLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = generateMockData(), mockCustomers = _a.mockCustomers, mockSessions = _a.mockSessions, mockMessages = _a.mockMessages;
                        // 模拟延迟
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 2:
                        // 模拟延迟
                        _b.sent();
                        setCustomers(mockCustomers);
                        setSessions(mockSessions);
                        setMessages(mockMessages);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _b.sent();
                        console.error('加载初始数据时出错:', error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadInitialData();
    }, [isAuthenticated]);
    // 创建会话
    var createSession = function (customerId, subject) { return __awaiter(_this, void 0, void 0, function () {
        var customer, newSession, systemMessage;
        return __generator(this, function (_a) {
            customer = customers.find(function (c) { return c.id === customerId; });
            if (!customer) {
                throw new Error('客户不存在');
            }
            newSession = {
                id: (0, types_2.generateId)('SESSION'),
                customerId: customerId,
                status: types_1.ChatStatus.PENDING,
                startTime: new Date(),
                tags: [],
                priority: 'medium',
                unreadCount: 0,
                lastMessageTime: new Date(),
            };
            if (subject) {
                newSession.subject = subject;
            }
            systemMessage = {
                id: (0, types_2.generateId)('MESSAGE'),
                sessionId: newSession.id,
                senderType: 'system',
                content: '会话已创建',
                contentType: 'system',
                timestamp: new Date().toISOString(),
                status: 'delivered',
            };
            // 更新状态
            setSessions(function (prev) { return __spreadArray([newSession], prev, true); });
            setMessages(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[newSession.id] = [systemMessage], _a)));
            });
            return [2 /*return*/, newSession.id];
        });
    }); };
    // 关闭会话
    var closeSession = function (sessionId) { return __awaiter(_this, void 0, void 0, function () {
        var session, systemMessage, updatedSession;
        return __generator(this, function (_a) {
            session = sessions.find(function (s) { return s.id === sessionId; });
            if (!session) {
                return [2 /*return*/, false];
            }
            systemMessage = {
                id: (0, types_2.generateId)('MESSAGE'),
                sessionId: sessionId,
                senderType: 'system',
                content: '会话已结束',
                contentType: 'system',
                timestamp: new Date().toISOString(),
                status: 'delivered',
            };
            updatedSession = __assign(__assign({}, session), { status: types_1.ChatStatus.RESOLVED, endTime: new Date(), lastMessageTime: new Date() });
            // 更新状态
            setSessions(function (prev) {
                return prev.map(function (s) { return s.id === sessionId ? updatedSession : s; });
            });
            // 添加系统消息
            setMessages(function (prev) {
                var _a;
                var sessionMessages = prev[sessionId] || [];
                return __assign(__assign({}, prev), (_a = {}, _a[sessionId] = __spreadArray(__spreadArray([], sessionMessages, true), [systemMessage], false), _a));
            });
            return [2 /*return*/, true];
        });
    }); };
    // 分配会话给客服
    var assignSession = function (sessionId, agentId) { return __awaiter(_this, void 0, void 0, function () {
        var session, updatedSession, systemMessage;
        return __generator(this, function (_a) {
            session = sessions.find(function (s) { return s.id === sessionId; });
            if (!session) {
                return [2 /*return*/, false];
            }
            updatedSession = __assign(__assign({}, session), { agentId: agentId, status: types_1.ChatStatus.ACTIVE });
            systemMessage = {
                id: (0, types_2.generateId)('MESSAGE'),
                sessionId: sessionId,
                senderType: 'system',
                content: "\u4F1A\u8BDD\u5DF2\u5206\u914D\u7ED9\u5BA2\u670D",
                contentType: 'system',
                timestamp: new Date().toISOString(),
                status: 'delivered',
            };
            // 更新状态
            setSessions(function (prev) {
                return prev.map(function (s) { return s.id === sessionId ? updatedSession : s; });
            });
            // 添加系统消息
            setMessages(function (prev) {
                var _a;
                var sessionMessages = prev[sessionId] || [];
                return __assign(__assign({}, prev), (_a = {}, _a[sessionId] = __spreadArray(__spreadArray([], sessionMessages, true), [systemMessage], false), _a));
            });
            return [2 /*return*/, true];
        });
    }); };
    // 发送消息
    var sendMessage = function (sessionId_1, content_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([sessionId_1, content_1], args_1, true), void 0, function (sessionId, content, type) {
            var session, contentType, newMessage, sentMessage, updatedSession;
            if (type === void 0) { type = types_1.MessageType.TEXT; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = sessions.find(function (s) { return s.id === sessionId; });
                        if (!session) {
                            return [2 /*return*/, null];
                        }
                        contentType = 'text';
                        switch (type) {
                            case types_1.MessageType.TEXT:
                                contentType = 'text';
                                break;
                            case types_1.MessageType.IMAGE:
                                contentType = 'image';
                                break;
                            case types_1.MessageType.FILE:
                                contentType = 'file';
                                break;
                            case types_1.MessageType.VOICE:
                                contentType = 'audio';
                                break;
                            case types_1.MessageType.VIDEO:
                                contentType = 'video';
                                break;
                            case types_1.MessageType.SYSTEM:
                                contentType = 'system';
                                break;
                        }
                        newMessage = {
                            id: (0, types_2.generateId)('MESSAGE'),
                            sessionId: sessionId,
                            senderType: 'agent',
                            content: content,
                            contentType: contentType,
                            timestamp: new Date().toISOString(),
                            status: 'sending',
                        };
                        // 更新消息列表
                        setMessages(function (prev) {
                            var _a;
                            var sessionMessages = prev[sessionId] || [];
                            return __assign(__assign({}, prev), (_a = {}, _a[sessionId] = __spreadArray(__spreadArray([], sessionMessages, true), [newMessage], false), _a));
                        });
                        // 模拟消息发送延迟
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // 模拟消息发送延迟
                        _a.sent();
                        sentMessage = __assign(__assign({}, newMessage), { status: 'sent' });
                        updatedSession = __assign(__assign({}, session), { lastMessageTime: new Date() });
                        // 更新状态
                        setMessages(function (prev) {
                            var _a;
                            var sessionMessages = prev[sessionId] || [];
                            var updatedMessages = sessionMessages.map(function (msg) {
                                return msg.id === newMessage.id ? sentMessage : msg;
                            });
                            return __assign(__assign({}, prev), (_a = {}, _a[sessionId] = updatedMessages, _a));
                        });
                        setSessions(function (prev) {
                            return prev.map(function (s) { return s.id === sessionId ? updatedSession : s; });
                        });
                        return [2 /*return*/, sentMessage];
                }
            });
        });
    };
    // 标记会话为已读
    var markAsRead = function (sessionId) { return __awaiter(_this, void 0, void 0, function () {
        var session, updatedSession, updatedMessages;
        return __generator(this, function (_a) {
            session = sessions.find(function (s) { return s.id === sessionId; });
            if (!session) {
                return [2 /*return*/, false];
            }
            updatedSession = __assign(__assign({}, session), { unreadCount: 0 });
            updatedMessages = (messages[sessionId] || []).map(function (msg) {
                if (msg.senderType === 'customer' && msg.status !== 'read') {
                    return __assign(__assign({}, msg), { status: 'read' });
                }
                return msg;
            });
            // 更新状态
            setSessions(function (prev) {
                return prev.map(function (s) { return s.id === sessionId ? updatedSession : s; });
            });
            // 确保类型兼容性
            setMessages(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[sessionId] = updatedMessages, _a)));
            });
            return [2 /*return*/, true];
        });
    }); };
    // 加载更多消息
    var loadMoreMessages = function (sessionId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 在实际应用中，这里应该从API加载更多历史消息
                // 现在我们只是模拟延迟
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    // 在实际应用中，这里应该从API加载更多历史消息
                    // 现在我们只是模拟延迟
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    }); };
    // 刷新会话列表
    var refreshSessions = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // 在实际应用中，这里应该从API重新加载会话
                    // 现在我们只是模拟延迟
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // 在实际应用中，这里应该从API重新加载会话
                    // 现在我们只是模拟延迟
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('刷新会话列表时出错:', error_2);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // 获取客户信息
    var getCustomer = function (customerId) {
        return customers.find(function (c) { return c.id === customerId; });
    };
    // 添加客户备注
    var addCustomerNote = function (customerId, note) { return __awaiter(_this, void 0, void 0, function () {
        var customer, updatedCustomer;
        return __generator(this, function (_a) {
            customer = customers.find(function (c) { return c.id === customerId; });
            if (!customer) {
                return [2 /*return*/, false];
            }
            updatedCustomer = __assign(__assign({}, customer), { notes: customer.notes ? "".concat(customer.notes, "\n").concat(note) : note });
            // 更新状态
            setCustomers(function (prev) {
                return prev.map(function (c) { return c.id === customerId ? updatedCustomer : c; });
            });
            return [2 /*return*/, true];
        });
    }); };
    // 上下文值
    var contextValue = {
        sessions: sessions,
        customers: customers,
        messages: messages,
        isLoading: isLoading,
        createSession: createSession,
        closeSession: closeSession,
        assignSession: assignSession,
        sendMessage: sendMessage,
        markAsRead: markAsRead,
        loadMoreMessages: loadMoreMessages,
        refreshSessions: refreshSessions,
        getCustomer: getCustomer,
        addCustomerNote: addCustomerNote,
    };
    return ((0, jsx_runtime_1.jsx)(AppContext.Provider, { value: contextValue, children: children }));
}
// 自定义钩子用于访问上下文
function useApp() {
    var context = (0, react_1.useContext)(AppContext);
    if (context === undefined) {
        throw new Error('useApp 必须在 AppProvider 内部使用');
    }
    return context;
}
