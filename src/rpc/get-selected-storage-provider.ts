// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { program } from "commander";
import { config } from "../config";
import { fetchStorageProviders } from "./fetch-storage-providers";
import { StorageProvider } from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/types";

/** Get the selected storage provider from the config or select the first one */

const storageProviders: StorageProvider[] = [];

export async function getStorageProvider(primarySpAddress?: string) {
  if (storageProviders.length == 0) {
    const fetchedStorageProviders = await fetchStorageProviders(); // Fetch all storage providers
    storageProviders.push(...fetchedStorageProviders);
  }
  if (storageProviders.length == 0) program.error("No storage providers found");

  let configuredSP: StorageProvider | undefined;

  if (primarySpAddress) {
    // If a storage provider address is passed, select it
    configuredSP = storageProviders.find(
      (sp) => sp.operatorAddress.toUpperCase() === primarySpAddress.toUpperCase()
    );

    if (!configuredSP) program.error("Storage provider not found");
  } else if (config.storageProviderMoniker) {
    // If a storage provider is configured via env, select it
    configuredSP = storageProviders.find((sp) => sp.description?.moniker === config.storageProviderMoniker);
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
export async function getSecondaryProviders(primarySpAddress: string) {
  if (storageProviders.length == 0) {
    const fetchedStorageProviders = await fetchStorageProviders(); // Fetch all storage providers
    storageProviders.push(...fetchedStorageProviders);
  }
  const spIndex = storageProviders.findIndex(
    (sp) => sp.operatorAddress.toUpperCase() === primarySpAddress.toUpperCase()
  );
  const restSPs = storageProviders.filter((_, idx) => idx != spIndex);
  return restSPs.map((item) => item.operatorAddress);
}
