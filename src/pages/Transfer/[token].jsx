import { Input, Title, Text, Flex, Button, Divider, Switch, Tooltip, LoadingOverlay } from "@mantine/core"
import { IconPlus, IconCircleArrowRightFilled } from "@tabler/icons-react"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useRef, useContext } from "react"
import TransferItem from "../../components/TransferItem"
import transferBlob from "../../utils/transfer"
import { notifications } from "@mantine/notifications"
import useGetBalance from "../../hooks/useGetBalance"
import { globalContext } from "../../App"
import { useEffect } from "react"
import { formatNumber, validAddress, displayAddress } from "../../utils"

export default function Transfer() {
    const nav = useNavigate()
    const params = useParams()
    const [list, setList] = useState([{ address: "", amount: "" }])
    const [currentView, setCurrentView] = useState("choose")
    const token = params.token
    const wrapperRef = useRef(null)
    const ctx = useContext(globalContext)
    const [blobs, eth] = useGetBalance(ctx.account.address)
    const balance = blobs.find((v) => v.ticker === token)?.balance
    const [maxFeePerGas, setMaxFeePerGas] = useState("")
    const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState("")
    const [maxFeePerBlobGas, setMaxFeePerBlobGas] = useState("")
    const [nonce, setNonce] = useState("")
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false)

    const doTransfer = async () => {
        setLoading(true)
        try {
            const transfers = []
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const newAddr = await validAddress(item.address)
                transfers.push({
                    to: newAddr,
                    amount: item.amount
                })
            }
            console.log({
                token,
                transfers,
                maxFeePerGas,
                maxPriorityFeePerGas,
                maxFeePerBlobGas,
                nonce
            })
            const hash = await transferBlob(
                token,
                transfers,
                maxFeePerGas,
                maxPriorityFeePerGas,
                maxFeePerBlobGas,
                nonce
            )
            setLoading(false)
            if (hash) {
                notifications.show({
                    title: "Success",
                    message: <a href={"https://etherscan.io/tx/" + hash} target="_blank">{"https://etherscan.io/tx/" + hash}</a>,
                    color: "green",
                    autoClose: false
                })
                nav('/')
            } else {
                notifications.show({
                    title: "Failed",
                    message: "Something wrong, please try again!",
                    color: "red",
                    autoClose: false
                })
            }
        } catch (error) {
            setLoading(false)
            console.error(error)
            notifications.show({
                title: "Failed",
                message: error.message,
                color: "red",
                autoClose: false
            })
        }
    }
    const goNext = async () => {
        const temp = JSON.parse(JSON.stringify(list))
        let hasError = false
        let totalAmount = 0
        if(temp.some(v => v.address.endsWith('.eth'))) {
            setLoading(true)
        }
        for (let i = 0; i < temp.length; i++) {
            const item = temp[i]
            const { address, amount } = item
            totalAmount += Number(amount)
            const newAddr = await validAddress(address)
            if (!newAddr) {
                item.addressError = "Invalid Address"
                hasError = true
            }
            if (Number(amount) < 0) {
                item.amountError = "Invalid Amount"
                hasError = true
            } else if (totalAmount > balance) {
                item.amountError = "Insufficient Balance"
                hasError = true
            } else if (isNaN(Number(amount))) {
                item.amountError = "Invalid Amount"
                hasError = true
            }
        }
        console.log(temp)
        setLoading(false)
        if (hasError) {
            setList(temp)
        } else {
            setCurrentView("send")
        }
    }
    return (
        <>
            <Title order={1} ta="center" c="white">
                Send {token}
            </Title>
            <br />
            <Text align="center">Balance: {formatNumber(balance)}</Text>
            <br />
            <Divider></Divider>
            {currentView === "choose" ? (
                <div style={{ paddingBottom: 70 }} className="transfer-wrapper" ref={wrapperRef}>
                    <div>
                        {list.map((v, idx) => (
                            <TransferItem
                                key={idx}
                                index={idx}
                                token={token}
                                balance={1}
                                address={v.address}
                                amount={v.amount}
                                addressError={v.addressError}
                                amountError={v.amountError}
                                showClose={idx !== 0}
                                setAddress={(value) => {
                                    setList((list) => {
                                        const temp = [...list]
                                        const item = temp[idx]
                                        item.address = value
                                        item.addressError = null
                                        temp.splice(idx, 1, item)
                                        return temp
                                    })
                                }}
                                setAmount={(value) => {
                                    setList((list) => {
                                        const temp = [...list]
                                        const item = temp[idx]
                                        item.amount = value
                                        item.amountError = null
                                        temp.splice(idx, 1, item)
                                        return temp
                                    })
                                }}
                                onClose={() => {
                                    setList((list) => {
                                        const temp = [...list]
                                        temp.splice(idx, 1)
                                        return temp
                                    })
                                }}
                                setMax={() => {
                                    setList((list) => {
                                        const temp = [...list]
                                        const item = temp[idx]
                                        const total = temp.reduce((prev, next) => prev + Number(next.amount), 0) - (item.amount || 0)
                                        item.amount = balance - total < 0 ? 0 : balance - total
                                        item.amountError = null
                                        temp.splice(idx, 1, item)
                                        return temp
                                    })
                                }}></TransferItem>
                        ))}
                    </div>
                    {token === "ETH" ? null : (
                        <Button
                            leftSection={<IconPlus size={14} />}
                            variant="subtle"
                            onClick={() => {
                                setList((list) => {
                                    const temp = [...list]
                                    temp.push({
                                        amount: "",
                                        address: "",
                                    })
                                    return temp
                                })
                                setTimeout(() => {
                                    wrapperRef.current.scrollTo(0, wrapperRef.current.scrollHeight)
                                })
                            }}>
                            Add More
                        </Button>
                    )}
                </div>
            ) : (
                <div>
                    {list.map((v, idx) => (
                        <Flex key={v.address} justify="space-between" h={40} align="center">
                            <Tooltip label={v.address}>
                                <a
                                    style={{ width: "47%", textDecorationLine: "none" }}
                                    className="cursor-pointer"
                                    target="_blank"
                                    href={`https://etherscan.io/address/${v.address}`}>
                                    {displayAddress(v.address, [4, -4])}
                                </a>
                            </Tooltip>

                            <IconCircleArrowRightFilled size={24} />
                            <span style={{ width: "47%", textAlign: "right" }}>
                                {v.amount} {token}
                            </span>
                        </Flex>
                    ))}
                    <Divider></Divider>

                    <Switch
                        label="Advanced Settings"
                        checked={checked}
                        onChange={(event) => {
                            setChecked(event.currentTarget.checked)
                            setMaxFeePerGas("")
                            setMaxPriorityFeePerGas("")
                            setMaxFeePerBlobGas("")
                            setNonce("")
                        }}
                        className="mt-2"
                    />
                    {checked ? (
                        <div>
                            <Flex justify="space-between" align="center" className="mt-2">
                                <Input.Wrapper label="MaxFeePerGas" style={{ width: "47%" }}>
                                    <Input value={maxFeePerGas} onChange={(e) => setMaxFeePerGas(e.target.value)} />
                                </Input.Wrapper>
                                <Input.Wrapper label="MaxPriorityFeePerGas" style={{ width: "47%" }}>
                                    <Input value={maxPriorityFeePerGas} onChange={(e) => setMaxPriorityFeePerGas(e.target.value)} />
                                </Input.Wrapper>
                            </Flex>
                            <Flex justify="space-between" align="center" className="mt-2">
                                <Input.Wrapper label="MaxFeePerBlobGas" style={{ width: "47%" }}>
                                    <Input value={maxFeePerBlobGas} onChange={(e) => setMaxFeePerBlobGas(e.target.value)} />
                                </Input.Wrapper>
                                <Input.Wrapper label="Nonce" style={{ width: "47%" }}>
                                    <Input value={nonce} onChange={(e) => setNonce(e.target.value)} />
                                </Input.Wrapper>
                            </Flex>
                        </div>
                    ) : null}
                </div>
            )}
            {currentView === "choose" ? (
                <Flex className="transfer-footer">
                    <Button fullWidth onClick={goNext}  loading={loading} loaderProps={{ type: "dots" }}>
                        Next
                    </Button>
                    <Button variant="light" className=" ml-2" onClick={() => nav("/")}>
                        Cancel
                    </Button>
                </Flex>
            ) : (
                <Flex className="transfer-footer">
                    <Button fullWidth onClick={doTransfer} loading={loading} loaderProps={{ type: "dots" }}>
                        Send
                    </Button>

                    <Button variant="light" className=" ml-2" onClick={() => setCurrentView("choose")} disabled={loading}>
                        Cancel
                    </Button>
                </Flex>
            )}
        </>
    )
}
