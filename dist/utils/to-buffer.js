"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBuffer = exports.isHexString = void 0;
const ethjs_util_1 = require("ethjs-util");
function isHexString(value, length) {
    if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/))
        return false;
    if (typeof length !== "undefined" && length > 0 && value.length !== 2 + 2 * length)
        return false;
    return true;
}
exports.isHexString = isHexString;
const toBuffer = function (v) {
    if (v === null || v === undefined) {
        return Buffer.allocUnsafe(0);
    }
    if (Buffer.isBuffer(v)) {
        return Buffer.from(v);
    }
    if (Array.isArray(v) || v instanceof Uint8Array) {
        return Buffer.from(v);
    }
    if (typeof v === "string") {
        if (!isHexString(v)) {
            throw new Error(`Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`);
        }
        return Buffer.from((0, ethjs_util_1.padToEven)((0, ethjs_util_1.stripHexPrefix)(v)), "hex");
    }
    if (typeof v === "number") {
        return (0, ethjs_util_1.intToBuffer)(v);
    }
    if (typeof v === "bigint") {
        if (v < BigInt(0)) {
            throw new Error(`Cannot convert negative bigint to buffer. Given: ${v}`);
        }
        let n = v.toString(16);
        if (n.length % 2)
            n = "0" + n;
        return Buffer.from(n, "hex");
    }
    if (v.toArray) {
        // converts a BN to a Buffer
        return Buffer.from(v.toArray());
    }
    if (v.toBuffer) {
        return Buffer.from(v.toBuffer());
    }
    throw new Error("invalid type");
};
exports.toBuffer = toBuffer;
