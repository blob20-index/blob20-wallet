import { Button, Text, Textarea, Title } from "@mantine/core"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { globalContext } from "../../App"
import { encryptPrivateKey, getAddressFromPk } from "../../utils"
import { notifications } from "@mantine/notifications"

export default function Create() {
    const nav = useNavigate()
    const ctx = useContext(globalContext)
    const [value, setValue] = useState("")
    const onCreate = () => {
        const pk = value.startsWith('0x') ? value.replace('0x','') : value
        const address = getAddressFromPk(pk)
        if (address) {
            encryptPrivateKey(value)
            notifications.show({
                title: "Success",
                message: "You have successfully imported a wallet!",
                color: "green",
            })
            ctx.setAccount({
                address
            })
            nav("/")
        }else {
            notifications.show({
                title: "Error",
                message: "Wrong private key!",
                color: "red",
            })
        }
    }
    return (
        <>
            <Title order={1} ta="center" c="white">
                Import Wallet
                <br />
                <br />
            </Title>
            <Text ta="center" size="md">
                Please Input your private key to import your wallet.
            </Text>
            <Textarea className="mt-50 mb-2" minRows={4} value={value} onChange={(e) => setValue(e.target.value)}></Textarea>
            <Button fullWidth onClick={onCreate}>
                Confirm
            </Button>
        </>
    )
}
