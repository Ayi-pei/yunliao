"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFrameworkReady = useFrameworkReady;
var react_1 = require("react");
function useFrameworkReady() {
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = window.frameworkReady) === null || _a === void 0 ? void 0 : _a.call(window);
    });
}
