import { loadKZG } from "kzg-wasm"
import * as cbor from "borc"
import { createWalletClient, http, toBlobs, parseGwei, stringToHex, createPublicClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet } from "viem/chains"
import { decryptPrivateKey } from "./index"
import { Chain, Common, Hardfork } from '@ethereumjs/common'

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
export const beforeTransfer = async (ticker,transfer) => {

}
const transferBlob = async (ticker, transfer,
    maxFeePerGas, maxPriorityFeePerGas, maxFeePerBlobGas, nonce
) => {
    const pk = decryptPrivateKey()
    if (!pk) {
        return
    }
    const account = privateKeyToAccount(pk.startsWith('0x') ? pk : ('0x' + pk))
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
    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http()
    })
    const fees = await publicClient.estimateFeesPerGas()
    const getMaxPriorityFeePerGas = fees => {
        const A = fees.maxPriorityFeePerGas * 2n
        const R = parseGwei("1");
        return A > R ? A : R
    }
    const getMaxFeePerGas = (fees) => {
        return fees.maxFeePerGas * 2n
    }
    const getMaxFeePerBlobGas = async () => {
        const common = new Common({
            chain: Chain.Mainnet,
            hardfork: Hardfork.Cancun,
            customCrypto: { kzg },
        })
        const Wn = BigInt(0)
        const $S = BigInt(1)
        const block = await publicClient.getBlock()
        const K$ = (e, t, n) => {
            let r = $S
                , i = Wn
                , o = e * n;
            for (; o > Wn;)
                i += o,
                    o = o * t / (n * r),
                    r++;
            return i / n
        }
        const K = K$(common.param("gasPrices", "minBlobGasPrice"), block.excessBlobGas, common.param("gasConfig", "blobGasPriceUpdateFraction"));
        const A = K * 2n
        const R = parseGwei("10")
        return A > R ? A : R
    }
    const getNonce = async () => {
        const transactionCount = await publicClient.getTransactionCount({
            address: account.address,
        })
        return transactionCount
    }
    const defaultMaxFeePerGas = getMaxFeePerGas(fees)
    const defaultMaxPriorityFeePerGas = getMaxPriorityFeePerGas(fees)
    const defaultMaxFeePerBlobGas = await getMaxFeePerBlobGas()
    const defaultNonce = await getNonce()
    const params = {
        kzg,
        blobs,
        account,
        to: account.address,
        data: stringToHex("data:;rule=esip6,"),
        value: 0n,
        type: "eip4844",
        maxFeePerGas: maxFeePerGas ? parseGwei(maxFeePerGas + '') : defaultMaxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas ? parseGwei(maxPriorityFeePerGas + '') : defaultMaxPriorityFeePerGas,
        maxFeePerBlobGas: maxFeePerBlobGas ? parseGwei(maxFeePerBlobGas + '') : defaultMaxFeePerBlobGas,
        nonce: nonce ? (nonce + '') :  defaultNonce
    }
    console.log(params)
    if(window.location.search === '?dev=1') {
        return
    }
    const hash = await client.sendTransaction(params)
    console.log("tx hash:", hash)
    return hash
}

export default transferBlob
