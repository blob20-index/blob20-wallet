import { Button, Text,Title } from "@mantine/core"
import { useNavigate } from "react-router-dom"

export default function Create() {
    const nav = useNavigate()
    return (
        <>
            <Title order={1} ta="center" c="white">
                Blob Wallet
                <br />
                <br />
            </Title>
            <Text  ta="center" size="md">
                Blob Wallet is web based wallet where all the user wallet important keys are securely stored with encrypted in User Browser.
            </Text>
            <Button fullWidth variant="white" className="mb-2 mt-50" onClick={() => nav('/wallet/create')}>
                Create Wallet
            </Button>
            <Button fullWidth  onClick={() => nav('/wallet/import')}>Import Wallet</Button>
        </>
    )
}
