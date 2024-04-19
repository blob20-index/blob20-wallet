import { Button, Text, Textarea, Title, Input, Alert } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { notifications } from "@mantine/notifications"
import { useContext, useEffect, useState } from "react"
import { globalContext } from "../../App"
import { ethers } from "ethers"
import { encryptPrivateKey } from "../../utils"
import { useDisclosure } from "@mantine/hooks"
import { Modal } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"

export default function Create() {
    const nav = useNavigate()
    const ctx = useContext(globalContext)
    const [value, setValue] = useState("")
    const [address, setAddress] = useState("")
    const [opened, { open, close }] = useDisclosure(false)
    useEffect(() => {
        const privateKey = ethers.utils.randomBytes(32)
        const keyNumber = ethers.BigNumber.from(privateKey)._hex
        const wallet = new ethers.Wallet(privateKey)
        setValue(keyNumber)
        setAddress(wallet.address)
    }, [])
    const onCreate = () => {
        encryptPrivateKey(value)
        notifications.show({
            title: "Success",
            message: "You have successfully created a wallet!",
            color: "green",
        })
        ctx.setAccount({
            address: address,
        })
        nav("/")
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
            <Input.Wrapper label="Address" className="mt-50 mb-2">
                <Input value={address} readOnly />
            </Input.Wrapper>

            <Textarea label="Private Key" readOnly minRows={4} value={value}></Textarea>
            <Alert variant="light" color="red" title="Warning" icon={<IconInfoCircle />} className="mt-2">
                Never disclose this key. Anyone with your private keys can steal any assets held in your account.
            </Alert>
            <Button fullWidth onClick={open} className="mt-2">
                Setup Wallet
            </Button>
            <Modal opened={opened} onClose={close} title="Save your private key" centered>
                <Title order={3}>This private key is used to recover your wallet so keep it at safe place.</Title>
                <Button fullWidth className="mt-2" onClick={onCreate}>
                    Confirm
                </Button>
            </Modal>
        </>
    )
}
