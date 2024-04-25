import { ethers } from "ethers"
import CryptoJS from "crypto-js"
import { RPC } from '../const/index'

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

export const formatNumber = (num) => new Intl.NumberFormat('en-us').format(num)

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

export const setLocalStoarge = (key,value) => {
    localStorage.setItem(key,JSON.stringify(value))
}
export const getLocalStoarge = (key,defaultValue) => {
    const json = localStorage.getItem(key)
    try {
        return json ? JSON.parse(json) : defaultValue
    } catch (error) {
        return defaultValue
    }
}
export function encryptPrivateKey(pk) {
    try {
        const key = getAddressFromPk(pk)
        if(key) {
            const encryptedData = CryptoJS.AES.encrypt(pk, key).toString()
            const pks = getLocalStoarge('__PK__',{})
            pks[key] = encryptedData
            setLocalStoarge('__PK__',pks)
            localStorage.setItem("__CURRENT_ADDRESS__", key)
            return encryptedData
        }else {
            return ''
        }
    } catch (error) {
        return ''
    }
}

export function decryptPrivateKey(currentAddress) {
    try {
        const json = getLocalStoarge("__PK__",{})
        const key = currentAddress || localStorage.getItem("__CURRENT_ADDRESS__")
        const encryptedData = json[key]
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8)
        return decryptedData
    } catch (error) {
        return ''
    }
}

export const getEthBalance = async (walletAddress) => {
    const provider = new ethers.providers.JsonRpcProvider(RPC)
    const balance = await provider.getBalance(walletAddress)
    const etherBalance = ethers.utils.formatEther(balance)
    return toRound(+etherBalance)
}

export const validAddress = async (address) => {
    if(address.endsWith('.eth')) {
        const provider = new ethers.providers.JsonRpcProvider(RPC)
        try {
            const res = await provider.resolveName(address)
            return res || ''
        } catch (error) {
            return ''
        }
    }else {
        return ethers.utils.isAddress(address) ? address : '';
    }
}