"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visibilityTypeMap = exports.visibilityFlags = exports.createBucketMessageTypes = void 0;
exports.createBucketMessageTypes = {
    Msg: [
        { name: "type", type: "string" },
        { name: "creator", type: "string" },
        { name: "bucket_name", type: "string" },
        { name: "visibility", type: "string" },
        { name: "payment_address", type: "string" },
        { name: "primary_sp_address", type: "string" },
        { name: "primary_sp_approval", type: "TypePrimarySpApproval" },
        { name: "charged_read_quota", type: "uint64" },
    ],
    TypePrimarySpApproval: [
        { name: "expired_height", type: "uint64" },
        { name: "sig", type: "bytes" },
    ],
};
exports.visibilityFlags = ["public-read", "private", "inherit"];
exports.visibilityTypeMap = {
    "public-read": "VISIBILITY_TYPE_PUBLIC_READ",
    private: "VISIBILITY_TYPE_PRIVATE",
    inherit: "VISIBILITY_TYPE_INHERIT",
};
