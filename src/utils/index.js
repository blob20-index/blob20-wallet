import { ethers } from "ethers"
import CryptoJS from "crypto-js"

export const displayAddress = (str, position = -6) => {
    if (!str) {
        return "-"
    }
    if (Array.isArray(position)) {
        return `${str.slice(0, position[0])}....${str.slice(position[1], str.length)}`
    }
    if (typeof position === "number") {
        return position < 0 ? `${str.slice(position, str.length)}` : `${str.slice(0, position)}`
    }
}

export const formatNumber = (num) => (num ? (num > 1 ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : num) : "")

export const toRound = (num, n = 4) => {
    const val = Number(num)
    if (val) {
        return Math.round(val * Math.pow(10, n)) / Math.pow(10, n)
    } else {
        return 0
    }
}

export const getAddressFromPk = (pk) => {
    try {
        const wallet = new ethers.Wallet(pk)
        return wallet.address
    } catch (error) {
        return ''
    }
}

export function encryptPrivateKey(pk) {
    try {
        const key = getAddressFromPk(pk)
        if(key) {
            const encryptedData = CryptoJS.AES.encrypt(pk, key).toString()
            localStorage.setItem("__PK__", encryptedData)
            localStorage.setItem("__ADDRESS__", key)
            return encryptedData
        }else {
            return ''
        }
    } catch (error) {
        return ''
    }
}

export function decryptPrivateKey() {
    try {
        const encryptedData = localStorage.getItem("__PK__")
        const key = localStorage.getItem("__ADDRESS__")
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8)
        return decryptedData
    } catch (error) {
        return ''
    }
}

export const getEthBalance = async (walletAddress) => {
    const rpcUrl = "https://rpc.flashbots.net"
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const balance = await provider.getBalance(walletAddress)
    const etherBalance = ethers.utils.formatEther(balance)
    return toRound(+etherBalance)
}
