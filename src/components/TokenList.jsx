import useGetBalance from "../hooks/useGetBalance"
import useGetEthPrice from "../hooks/useGetEthPrice"
import Token from "../components/Token"
import { useEffect } from "react"

const TokenList = ({ address, onClick, setBalance, hideNativeToken = false }) => {
    const [blobs, eth] = useGetBalance(address)
    const ethPrice = useGetEthPrice()
    useEffect(() => {
        setBalance?.({ blobs, eth, ethPrice })
    }, [blobs, eth, ethPrice])

    return (
        <div className="mt-2 overflow pr-2">
            {hideNativeToken ? null : (
                <Token
                    name="ETH"
                    price={ethPrice}
                    balance={eth}
                    isNativeToken
                    onClick={() => onClick?.({ ticker: "ETH", balance: eth, isNativeToken: true })}></Token>
            )}
            {blobs.map((v) => (
                <Token
                    name={v.ticker}
                    price={0}
                    balance={v.balance}
                    key={v.ticker}
                    onClick={() => onClick?.({ ticker: v.ticker, balance: v.balance, isNativeToken: false })}></Token>
            ))}
        </div>
    )
}

export default TokenList
