import { Button, Text, Textarea ,Title} from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { notifications } from "@mantine/notifications"
import { useContext } from "react"
import { globalContext } from "../../App"

export default function Create() {
    const nav = useNavigate()
    const ctx = useContext(globalContext)
    const onCreate = () => {
        // notifications.show({
        //     title: "Notification",
        //     message: "You have successfully created a wallet!",
        //     color: "green",
        // })
        // ctx.setAccount({
        //     address: "xxxx",
        // })
        // nav("/")
    }
    return (
        <>
            <Title order={1} ta="center" c="white">
                Save Private Key
                <br />
                <br />
            </Title>
            <Text ta="center" size="md">
                This private key is used to recover your wallet so keep it at safe place.
            </Text>
            <Textarea className="mt-50 mb-2" readOnly minRows={4}></Textarea>
            <Button fullWidth onClick={onCreate}>
                Create Wallet
            </Button>
        </>
    )
}
