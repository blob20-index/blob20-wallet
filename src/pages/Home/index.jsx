import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { globalContext } from "../../App"
import { Flex, Text, Divider, Button, Menu, ActionIcon } from "@mantine/core"
import Copy from "../../components/Copy"
import TokenList from "../../components/TokenList"
import { displayAddress, formatNumber, encryptPrivateKey, toRound } from "../../utils"
import { IconSend, IconSettings2 } from "@tabler/icons-react"
import WalletPage from "../Wallet/index"
import { IconFileExport } from "@tabler/icons-react"

export default function Home() {
    const ctx = useContext(globalContext)
    const nav = useNavigate()
    const [total, setTotal] = useState(0)
    // useEffect(() => {
    //     if (!ctx.account.address) {
    //         nav("/wallet")
    //     }
    // }, [ctx.account])
    const onTokenItemClick = (item) => {
        console.log(item)
    }
    const setBalance = ({ blobs, eth, ethPrice }) => {
        setTotal(toRound(eth * ethPrice))
    }
    return ctx.account.address ? (
        <>
            <Flex justify="space-between" align="center">
                <Text>{displayAddress(ctx.account.address, [6, -6])}</Text>
                <Flex>
                    <Copy value={ctx.account.address}></Copy>
                    <Menu shadow="md" position="bottom-end" withArrow>
                        <Menu.Target>
                            <ActionIcon variant="transparent" aria-label="Settings">
                                <IconSettings2 size={18}></IconSettings2>
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item leftSection={<IconFileExport />} onClick={() => nav('/wallet/export')}>Export Wallet</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
            </Flex>
            <div className="py-4">
                <Text style={{ fontSize: 48 }} fw={600} color="white">
                    $ {formatNumber(total)}
                </Text>

                <Button variant="light" rightSection={<IconSend size={14} />} className="mt-2" onClick={() => nav("/transfer")}>
                    Transfer
                </Button>
            </div>
            <Divider></Divider>
            <TokenList address={ctx.account.address} onClick={onTokenItemClick} setBalance={setBalance}></TokenList>
        </>
    ) : (
        <WalletPage></WalletPage>
    )
}
