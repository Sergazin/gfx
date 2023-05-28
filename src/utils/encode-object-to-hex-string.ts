// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
export function encodeObjectToHexString(jsonObject: any) {
  const utf8Encoder = new TextEncoder();
  const utf8Bytes = utf8Encoder.encode(JSON.stringify(jsonObject));
  return Array.from(utf8Bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const hexToBytes = (hex = "") => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
};

function uint8ArrayToJson(uint8Array: Uint8Array) {
  const decoder = new TextDecoder("utf-8");
  const jsonString = decoder.decode(uint8Array);
  return JSON.parse(jsonString);
}

export const decodeObjectFromHexString = (hex = "") => {
  return uint8ArrayToJson(hexToBytes(hex));
};
