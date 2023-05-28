"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecondaryProviders = exports.getStorageProvider = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const commander_1 = require("commander");
const config_1 = require("../config");
const fetch_storage_providers_1 = require("./fetch-storage-providers");
/** Get the selected storage provider from the config or select the first one */
const storageProviders = [];
async function getStorageProvider(primarySpAddress) {
    if (storageProviders.length == 0) {
        const fetchedStorageProviders = await (0, fetch_storage_providers_1.fetchStorageProviders)(); // Fetch all storage providers
        storageProviders.push(...fetchedStorageProviders);
    }
    if (storageProviders.length == 0)
        commander_1.program.error("No storage providers found");
    let configuredSP;
    if (primarySpAddress) {
        // If a storage provider address is passed, select it
        configuredSP = storageProviders.find((sp) => sp.operatorAddress.toUpperCase() === primarySpAddress.toUpperCase());
        if (!configuredSP)
            commander_1.program.error("Storage provider not found");
    }
    else if (config_1.config.storageProviderMoniker) {
        // If a storage provider is configured via env, select it
        configuredSP = storageProviders.find((sp) => sp.description?.moniker === config_1.config.storageProviderMoniker);
    }
    // If no storage provider is found, select the first one by default
    const sp = configuredSP || storageProviders[0];
    return sp;
    /**
    const spIndex = storageProviders.indexOf(sp);
    const restSPs = storageProviders.filter((_, idx) => idx != spIndex);
  
    return {
      moniker: sp.description?.moniker,
      endpoint: sp.endpoint,
      primarySpAddress: sp.operatorAddress,
      sealAddress: sp.sealAddress,
      secondarySpAddresses: restSPs.map((item) => item.operatorAddress),
    };
    * */
}
exports.getStorageProvider = getStorageProvider;
async function getSecondaryProviders(primarySpAddress) {
    if (storageProviders.length == 0) {
        const fetchedStorageProviders = await (0, fetch_storage_providers_1.fetchStorageProviders)(); // Fetch all storage providers
        storageProviders.push(...fetchedStorageProviders);
    }
    const spIndex = storageProviders.findIndex((sp) => sp.operatorAddress.toUpperCase() === primarySpAddress.toUpperCase());
    const restSPs = storageProviders.filter((_, idx) => idx != spIndex);
    return restSPs.map((item) => item.operatorAddress);
}
exports.getSecondaryProviders = getSecondaryProviders;
