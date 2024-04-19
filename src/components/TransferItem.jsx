import { Input, Title, Text, Flex, Button, Divider, ActionIcon, CloseButton } from "@mantine/core"

const TransferItem = ({ address, amount, showClose, onClose, setAddress, setAmount, token, setMax ,index, addressError,amountError}) => {
    return (
        <div className="py-2">
            <Input.Wrapper
                label={
                    <Flex align="center" justify="space-between">
                        <span>Address {index === 0 ? '' : `#${index + 1}`}</span>
                        {showClose && <CloseButton c="red" onClick={onClose}></CloseButton>}
                    </Flex>
                }
                error={addressError}
              >
                <Input placeholder="Enter public address(0x) or ENS name" value={address} onChange={(e) => setAddress(e.target.value)} />
            </Input.Wrapper>
            <Input.Wrapper
                className="mt-2 mb-2"
                error={amountError}
                label={
                    <Flex align="center" justify="space-between">
                        Amount
                        <Text c="blue" className="cursor-pointer" onClick={setMax}>
                            Max
                        </Text>
                    </Flex>
                }>
                <Input placeholder={`Enter ${token} amount`} rightSection={<span className="pr-2">{token}</span>} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Input.Wrapper>
            <Divider></Divider>
        </div>
    )
}

export default TransferItem
