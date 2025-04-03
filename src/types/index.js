"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateKey = exports.generateId = exports.ConnectionStatus = exports.MessageType = exports.ChatStatus = exports.AgentStatus = exports.getCurrentKey = exports.getCurrentKeyIndex = exports.PRESET_KEYS = exports.PREFIXES = void 0;
var nanoid_1 = require("nanoid");
// 前缀常量
exports.PREFIXES = {
    AGENT: 'agent_',
    CUSTOMER: 'cust_',
    MESSAGE: 'msg_',
    SESSION: 'sess_',
    KEY: 'key_',
};
// 预设的30个密钥
exports.PRESET_KEYS = Array.from({ length: 30 }, function () {
    return "".concat(exports.PREFIXES.KEY).concat((0, nanoid_1.nanoid)(16));
});
// 当前有效密钥索引计算（基于日期的轮换）
var getCurrentKeyIndex = function () {
    var now = new Date();
    return (now.getDate() + now.getMonth()) % exports.PRESET_KEYS.length;
};
exports.getCurrentKeyIndex = getCurrentKeyIndex;
// 获取当前有效密钥
var getCurrentKey = function () {
    return exports.PRESET_KEYS[(0, exports.getCurrentKeyIndex)()];
};
exports.getCurrentKey = getCurrentKey;
// 工作状态
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["ONLINE"] = "online";
    AgentStatus["BUSY"] = "busy";
    AgentStatus["OFFLINE"] = "offline";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
// 聊天状态
var ChatStatus;
(function (ChatStatus) {
    ChatStatus["ACTIVE"] = "active";
    ChatStatus["PENDING"] = "pending";
    ChatStatus["RESOLVED"] = "resolved";
})(ChatStatus || (exports.ChatStatus = ChatStatus = {}));
// 消息类型
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["FILE"] = "file";
    MessageType["VOICE"] = "voice";
    MessageType["VIDEO"] = "video";
    MessageType["SYSTEM"] = "system";
})(MessageType || (exports.MessageType = MessageType = {}));
// 网络连接状态
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["CONNECTED"] = "connected";
    ConnectionStatus["DISCONNECTED"] = "disconnected";
    ConnectionStatus["CONNECTING"] = "connecting";
})(ConnectionStatus || (exports.ConnectionStatus = ConnectionStatus = {}));
// 用于生成带前缀的nanoid的辅助函数
var generateId = function (prefix) {
    return "".concat(prefix, "_").concat((0, nanoid_1.nanoid)(10));
};
exports.generateId = generateId;
// 验证密钥是否有效
var validateKey = function (key) {
    // 硬编码管理员密钥
    if (key === 'adminayi888') {
        return true;
    }
    return exports.PRESET_KEYS.includes(key) || key === (0, exports.getCurrentKey)();
};
exports.validateKey = validateKey;
