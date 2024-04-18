import { useState, useEffect } from "react"
import { getEthPrice } from "../apis"


const useGetEthPrice = (address) => {
    const [price, setPrice] = useState(0)

    useEffect(() => {
        getEthPrice().then(setPrice)
    }, [])

    return [price]
}

export default useGetEthPrice
