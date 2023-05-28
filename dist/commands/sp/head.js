"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headStorageProvider = void 0;
const fetch_storage_providers_1 = require("../../rpc/fetch-storage-providers");
const commander_1 = require("commander");
const print_1 = require("../../utils/print");
async function headStorageProvider(endpoint) {
    const providers = await (0, fetch_storage_providers_1.fetchStorageProviders)();
    const found = providers.find((p) => p.endpoint === endpoint);
    if (!found)
        commander_1.program.error(`Storage Provider ${endpoint} not found ❌`);
    (0, print_1.gfxPrint)(formatStorageProvider(found));
}
exports.headStorageProvider = headStorageProvider;
function formatStorageProvider(storageProvider) {
    const formattedObject = {
        "👤 Operator Address": storageProvider.operatorAddress,
        "💰 Funding Address": storageProvider.fundingAddress,
        "🔒 Seal Address": storageProvider.sealAddress,
        "✅ Approval Address": storageProvider.approvalAddress,
        "🗑️  GC Address": storageProvider.gcAddress,
        "💸 Total Deposit": storageProvider.totalDeposit,
        "🟢 Status": storageProvider.status,
        "🔗 Endpoint": storageProvider.endpoint,
        "📝 Description": JSON.stringify(storageProvider.description),
    };
    let formattedString = "";
    for (const key in formattedObject) {
        formattedString += `${key.cyan}: ` + `${formattedObject[key]}`.white.bgBlack + `\n`;
    }
    return `${storageProvider.description?.moniker.yellow}\n${formattedString}`;
}
