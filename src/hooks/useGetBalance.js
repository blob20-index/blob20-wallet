import { useState, useEffect } from "react"
import { getAccountInfo } from "../apis"
import { getEthBalance } from "../utils"

const useGetBalance = (address) => {
    const [blobs, setBlobs] = useState([])
    const [eth, setEth] = useState(0)

    useEffect(() => {
        if (address) {
            setEth(0)
            setBlobs([])
            Promise.all([getAccountInfo({ address }), getEthBalance(address)]).then(([blob, eth]) => {
                setBlobs(blob || [])
                setEth(eth)
            })
        }
    }, [address])

    return [blobs, eth]
}

export default useGetBalance
