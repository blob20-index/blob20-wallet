import axios from "axios"
const BASEURL = 'http://blob20.art/api'

export const getAccountInfo = async (params) => {
    const res = await axios.get(BASEURL + '/getAccounts',{params})
    return res.data
}

export const getTxInfo = async (params) => {
    const res = await axios.get(BASEURL + '/getRecords',{params})
    return res.data
}

export const getEthPrice = async () => {
    const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    return res.data.ethereum.usd
}