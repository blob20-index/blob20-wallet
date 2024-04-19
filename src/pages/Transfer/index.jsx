import { Input, Title, Text, Flex, Button, Divider, ActionIcon, CloseButton } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import { useNavigate,useParams} from "react-router-dom"
import { useState,useRef,useContext } from "react"
import { globalContext } from "../../App"
import TokenList from '../../components/TokenList'

export default function Transfer() {
    const nav = useNavigate()
    const ctx = useContext(globalContext)
    const onTokenItemClick = (item) => {
        nav('/transfer/' + item.ticker)
    }
    return (
        <>
            <Title order={1} ta="center" c="white">
                Select Token
                <br />
                <br />
            </Title>
            <Divider></Divider>
            <TokenList address={ctx.account.address} hideNativeToken onClick={onTokenItemClick}></TokenList>
            <Flex className="transfer-footer">
                <Button variant="light" fullWidth onClick={() => nav("/")}>
                    Cancel
                </Button>
            </Flex>
        </>
    )
}
