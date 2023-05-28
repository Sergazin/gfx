"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStorageProviders = void 0;
const fetch_storage_providers_1 = require("../../rpc/fetch-storage-providers");
const print_1 = require("../../utils/print");
function formatStorageProvider(sp, idx) {
    const br = "    ";
    const { operatorAddress, endpoint, status, description } = sp;
    return `\x1b[36m⚙️  Storage Provider #${idx}\x1b[0m
${br}Moniker:          ${description?.moniker}
${br}Endpoint:         ${endpoint}
${br}Status:           ${status == 0 ? "In Service ✅" : "Not in Service ❌"}
${br}Operator addr:    ${operatorAddress}`;
}
async function listStorageProviders() {
    (0, print_1.gfxPrint)("Fetching storage providers... ⌛️");
    const providers = await (0, fetch_storage_providers_1.fetchStorageProviders)();
    const formattedProviders = providers.map(formatStorageProvider);
    console.log(formattedProviders.join("\n"));
}
exports.listStorageProviders = listStorageProviders;
