import { Button, Text, Textarea, Title, Overlay } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { notifications } from "@mantine/notifications"
import { useContext, useEffect, useState } from "react"
import { globalContext } from "../../App"
import { ethers } from "ethers"
import { encryptPrivateKey, decryptPrivateKey, getAddressFromPk } from "../../utils"
import { useDisclosure } from "@mantine/hooks"
import { Modal } from "@mantine/core"

export default function Create() {
    const nav = useNavigate()
    const ctx = useContext(globalContext)
    const [value, setValue] = useState("")
    const [address, setAddress] = useState("")
    const [visible, setVisible] = useState(true);
    const [opened, { open, close }] = useDisclosure(false)
    useEffect(() => {
        const pk = decryptPrivateKey()
        const address = getAddressFromPk(pk)
        setAddress(address)
        setValue(pk)
    }, [])
    const onView = () => {
        close()
        const pk = decryptPrivateKey()
        const address = getAddressFromPk(pk)
        setValue(pk)
        setVisible(false)
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
            <div className="mt-50" style={{position: 'relative'}}>
                <Textarea label="Private Key" readOnly minRows={4} value={value}></Textarea>
                {visible && <Overlay color="#000" backgroundOpacity={0.85} blur={30} />}
            </div>

            <Button fullWidth onClick={open} className="mt-2">
                Show Private Key
            </Button>
            <Button fullWidth  variant="light"  onClick={() => nav('/')} className="mt-2">
                Cancel
            </Button>
            <Modal opened={opened} onClose={close} title="Save your private key" centered>
                <Title order={3}>This private key is used to recover your wallet so keep it at safe place.</Title>
                <Button fullWidth className="mt-2" onClick={onView}>Confirm</Button>
            </Modal>
        </>
    )
}
