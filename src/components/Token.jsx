import { Flex, Text } from "@mantine/core"
import { formatNumber, toRound } from "../utils"

const Token = ({ name, balance, price ,isNativeToken,onClick}) => {
    return (
        <Flex h={60} align="center" justify="space-between" className="token-item mb-1 cursor-pointer" onClick={() => {
            onClick?.()
        }}>
            <Flex align="center">
                <div className="img-wrapper">
                    <img src={`/imgs/${name}.svg`} alt="" />
                </div>
                <div className="ml-1">
                    <Text c="white" size="lg">{name}</Text>
                    {price ? <Text c="dimmed" size="xs">${formatNumber(price)}</Text> : null}
                </div>
            </Flex>
            <div>
                <Text align="right" c="white" size="lg">{balance}</Text>
                {price ? <Text align="right" c="dimmed" size="xs">${formatNumber(toRound(price * balance))}</Text> : null}
            </div>
        </Flex>
    )
}

export default Token
