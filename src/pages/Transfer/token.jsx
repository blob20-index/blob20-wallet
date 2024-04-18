import { Input, Title, Text, Flex, Button, Divider, ActionIcon, CloseButton } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useRef } from "react"
import TransferItem from "../../components/TransferItem"
import transferBlob from "../../utils/transfer"

export default function Transfer() {
    const nav = useNavigate()
    const params = useParams()
    const [list, setList] = useState([{ address: "", amount: "" }])
    const token = params.token
    const wrapperRef = useRef(null)

    return (
        <>
            <Title order={1} ta="center" c="white">
                Send {token}
                <br />
                <br />
            </Title>
            <Divider></Divider>
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
                            showClose={idx !== 0}
                            setAddress={(value) => {
                                setList((list) => {
                                    const temp = [...list]
                                    const item = temp[idx]
                                    item.address = value
                                    temp.splice(idx, 1, item)
                                    return temp
                                })
                            }}
                            setAmount={(value) => {
                                setList((list) => {
                                    const temp = [...list]
                                    const item = temp[idx]
                                    item.amount = value
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
                            setMax={() => {}}></TransferItem>
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
            <Flex className="transfer-footer">
                <Button
                    fullWidth
                    onClick={() => {
                        console.log(list)
                        transferBlob(token,list.map(v => ({
                            to_address: v.address,
                            amount: v.amount
                        })))
                    }}>
                    Confirm
                </Button>
                <Button variant="light" className=" ml-2" onClick={() => nav("/")}>
                    Cancel
                </Button>
            </Flex>
        </>
    )
}
