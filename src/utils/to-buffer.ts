import { TransformableToArray, TransformableToBuffer } from "@ethereumjs/util";
import { intToBuffer, padToEven, stripHexPrefix } from "ethjs-util";

export function isHexString(value: string, length?: number): boolean {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) return false;
  if (typeof length !== "undefined" && length > 0 && value.length !== 2 + 2 * length) return false;
  return true;
}

export const toBuffer = function (
  v:
    | number
    | bigint
    | Buffer
    | Uint8Array
    | number[]
    | TransformableToArray
    | TransformableToBuffer
    | null
    | undefined
): Buffer {
  if (v === null || v === undefined) {
    return Buffer.allocUnsafe(0);
  }

  if (Buffer.isBuffer(v)) {
    return Buffer.from(v);
  }

  if (Array.isArray(v) || v instanceof Uint8Array) {
    return Buffer.from(v as Uint8Array);
  }

  if (typeof v === "string") {
    if (!isHexString(v)) {
      throw new Error(
        `Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`
      );
    }
    return Buffer.from(padToEven(stripHexPrefix(v)), "hex");
  }

  if (typeof v === "number") {
    return intToBuffer(v);
  }

  if (typeof v === "bigint") {
    if (v < BigInt(0)) {
      throw new Error(`Cannot convert negative bigint to buffer. Given: ${v}`);
    }
    let n = v.toString(16);
    if (n.length % 2) n = "0" + n;
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
