// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { getGateWays } from "@/rpc/gate-ways";
import { coreMessageTypes } from "./types";
import { program } from "commander";
import { privateKeyToCosmosPublicKey } from "@/utils/cosmos/private-key-to-cosmos-public-key";
import { getAuthInfoBytes } from "./get-auth-info-bytes";
import { MessageTypes, SignTypedDataVersion, signTypedData } from "@metamask/eth-sig-util";
import { toBuffer } from "@ethereumjs/util";
import { TxRaw } from "@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx";
import { txSimulate } from "./tx-simulate";
import { getPrivateKey } from "@/utils/get-private-key";
import { getAccountInfo } from "./get-account-info";
import { KEY } from "@/config";
import { gfxPrint } from "@/utils/print";

export type TxBroadcastOptions = {
  key: typeof KEY;
  msg: object;
  msgTypes: Record<string, { name: string; type: string }[]>;
  bodyBytes: Uint8Array;
  chainId: string;
  denom: string;
};

export async function txBroadcast(broadcastOptions: TxBroadcastOptions) {
  const gateWays = await getGateWays();

  const { chainId, msg, msgTypes, bodyBytes, key, denom } = broadcastOptions;

  // Get account info
  const accountInfo = await getAccountInfo(key.address);
  // Simulate the transaction to get the gasLimit and gasPrice
  const { gasLimit, gasPrice } = await txSimulate({ accountInfo, bodyBytes, denom });
  gfxPrint(`Tx Simation Success ✅: gasLimit: ${gasLimit}, gasPrice: ${gasPrice}`);

  const privateKey = getPrivateKey();

  if (!privateKey) program.error("No private key provided");

  const cosmosPublicKey = await privateKeyToCosmosPublicKey(privateKey);

  const types: MessageTypes = { ...coreMessageTypes, ...msgTypes };

  const signature = signTypedData({
    data: {
      types,
      primaryType: "Tx",
      domain: {
        name: "Greenfield Tx",
        version: "1.0.0",
        chainId: parseInt(chainId),
        verifyingContract: "greenfield",
        // @ts-expect-error diff from metamask
        salt: "0",
      },
      message: {
        account_number: accountInfo.accountNumber.toString(),
        chain_id: chainId,
        sequence: accountInfo.sequence.toString(),
        memo: "",
        fee: {
          amount: [
            {
              amount: String(BigInt(gasLimit) * BigInt(gasPrice)),
              denom,
            },
          ],
          gas_limit: String(gasLimit),
          payer: key.address,
          granter: "",
        },
        msg,
        timeout_height: "0",
      },
    },
    version: SignTypedDataVersion.V4,
    privateKey: toBuffer(privateKey),
  });

  // Prepare TxRaw
  const rawTx = TxRaw.fromPartial({
    bodyBytes,
    authInfoBytes: getAuthInfoBytes({
      denom,
      sequence: accountInfo.sequence + "",
      gasLimit,
      gasPrice,
      pubKey: cosmosPublicKey,
    }),
    signatures: [toBuffer(signature)],
  });

  const encodedRawTx = TxRaw.encode(rawTx).finish();
  const deliverTxResponse = await gateWays.stargate.broadcastTx(encodedRawTx);
  return deliverTxResponse;
}

/**
const sample =
  "CvkFCvYFCiMvZ3JlZW5maWVsZC5zdG9yYWdlLk1zZ0NyZWF0ZU9iamVjdBLOBQoqMHhmNThFMUFkNjNGRTIyQjU1MUNkNDg4NDM5RGY5NEVBMGRlOTg1QzM2EgV3d3cxNxodaGVscHMtMjAyMy0wNS0yOCAxMDozNzoxOC50eHQgyAsoAjIKdGV4dC9wbGFpbjpHCNDPBRJB5mHFvz0Z4zsfBK5626tn+JVIZaH6OGvFls33AovkpOEnOVasrL+8lSSr29vvaTNvdkwWIorSsuPr5/j8pfvmXQFCIKJgoRoZQmKcp8Zmes1OzAghOzPn94HsXjygO7twlxnSQiDBRH36S2dfqfM8e3fh9eMCx6WIL7EELtP5cPBxK0BcjUIgD5D3i2TpKWKHeM6dAU1kL4FV0723HuOAbQy4ljcg8S5CIFjUA7FzKeQlMMBwWZTUs5sgK11tsdKxD0ocKrH1+5CBQiBuRZaQqxmxe8qxahblxRMTaTOOWyzQbfSIIoESFeqNSkIgh6zc+ZcqZVLavmoHelwPlxekEo1WJ7NyXNd+YHT5BztCIKsFlSm2dMJbKPawa4ctO02Cdc3R73+KEZnbZDDquygoUioweDIyODA0NTA0Nzg2RjQ0Mjg5RDQxNTZFNzMxNzE0MmUyNUI5MmMwMGVSKjB4M0NGQzhiMjA5NURBOEYwNzIyNDEyRGMxNmY4QTA2Nzk0MmQyYzY5N1IqMHg1RTM0MEMwNzIxYkQ1ZjQ5NjI3ZTdFMzRlYjk0YmVkZkE1NzVFOTkzUioweDc3MTVkMDY4MGZFODRjQTZkN2VhRUY2ZThBN0NBY0UyOWE0QzAwNjRSKjB4YTNhYzhjMDk5OWI3M2YwMjgxMjJDRTYwOWUzMThjN2RhMDljYjc1MlIqMHhDNmZBM0YzNjQwZTNiNTk0MzM1ZWZBYjM0OWFiZEQ0QTgyQzgzNzM2UioweEU0MkI1QUQ5MEFmRjFlOEFkOTBGNzZlMDI1NDFBNzFDYTlENDFBMTESdQpYCk0KJi9jb3Ntb3MuY3J5cHRvLmV0aC5ldGhzZWNwMjU2azEuUHViS2V5EiMKIQLZ6pULJmtdzFN5IFlJS3cvrgKBPYNQXwsY3dNE1rR80hIFCgMIyAUYXBIZChQKA0JOQhINNjAwMDAwMDAwMDAwMBCwCRpBJw2nuJNBI9Y1pf5OiEXKtqVUfOaCebdAD17tCr4d+bdoz6joxIW3ApPttuT/ZY5/mEo9cRRRW2DtnWJIqpSAbhw=";

const decoded = TxRaw.decode(new Uint8Array(Buffer.from(sample, "base64")));
const bodyBytes = Buffer.from(decoded.bodyBytes)

const msg = TxBody.decode(bodyBytes).messages[0].value;
console.log({msg:MsgCreateObject.decode(msg)})

* */
