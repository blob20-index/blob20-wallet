import { useState, useEffect } from "react"
import { decryptPrivateKey, getAddressFromPk } from "../utils"

const useGetAccount = () => {
    const [account, setAccount] = useState({
        address: localStorage.getItem('__ADDRESS__') || '',
    })

    useEffect(() => {
        const pk = decryptPrivateKey()
        const address = getAddressFromPk(pk)
        setAccount({
            address: address || "",
        })
    }, [])

    return [account, setAccount]
}

export default useGetAccount
