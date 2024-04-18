import { loadKZG } from "kzg-wasm"
import * as cbor from "borc"
import { createWalletClient, http, toBlobs, parseGwei, stringToHex } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet } from "viem/chains"
import { decryptPrivateKey } from "./index"

function transferToken(ticker, transfers) {
    return {
        protocol: "blob20",
        token: {
            operation: "transfer",
            ticker: ticker,
            transfers,
        },
    }
}
// const ticker = "blob" //需要转账的token
// const transfer = [
//     {
//         to_address: "这里填写接收的钱包地址 0x...", //设置接收钱包地址
//         amount: "1000", //转账数量
//     },
// ]

const transferBlob = async (ticker, transfer, maxFeePerGas, maxPriorityFeePerGas, maxFeePerBlobGas, nonce) => {
    const pk = decryptPrivateKey()
    if(!pk) {
        return
    }
    const account = privateKeyToAccount('0x' + pk)
    const client = createWalletClient({
        account,
        chain: mainnet,
        transport: http("https://1rpc.io/eth"),
    })
    const transfer_json = JSON.stringify(transferToken(ticker, transfer))
    const blob20blobscription = cbor.encode({
        contentType: "application/json",
        content: transfer_json,
    })
    const blobs = toBlobs({ data: blob20blobscription })
    const kzg = await loadKZG()
    const hash = await client.sendTransaction({
        kzg,
        blobs,
        account,
        to: account.address,
        data: stringToHex("data:;rule=esip6,"),
        value: 0n,
        type: "eip4844",
        // maxFeePerGas: parseGwei(14 + ""), //主网gas费
        // maxPriorityFeePerGas: parseGwei(1 + ""), //主网矿工小费
        maxFeePerBlobGas: parseGwei(1 + ""), //设置Blob链上gas
        // nonce,
    })
    console.log("Blob转账完成，等待链上打包确认!")
    console.log("转账hash:", hash)
    return hash
}

export default transferBlob
