import { useState, useEffect } from "react"
import { getAccountInfo } from "../apis"
import { getEthBalance } from "../utils"

const useGetBalance = (address) => {
    const [blobs, setBlobs] = useState([{
        ticker: 'BLOB',
        protocol: 'blob20',
        balance: ''
    }])
    const [eth, setEth] = useState(0)

    useEffect(() => {
        if (address) {
            Promise.all([getAccountInfo({ address }), getEthBalance(address)]).then(([blob, eth]) => {
                setBlobs(blob || [])
                setEth(eth)
            })
        }
    }, [address])

    return [blobs,eth]
}

export default useGetBalance
