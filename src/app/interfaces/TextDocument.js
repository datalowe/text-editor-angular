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
exports.__esModule = true;
exports.codeEmptyDoc = exports.regularEmptyDoc = void 0;
var emptyDocBasis = {
    id: '',
    title: '',
    body: '',
    owner: { username: '', id: '' },
    editors: []
};
exports.regularEmptyDoc = __assign(__assign({}, emptyDocBasis), { type: "regular" });
exports.codeEmptyDoc = __assign(__assign({}, emptyDocBasis), { type: "code" });
