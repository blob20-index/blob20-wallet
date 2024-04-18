import { useState, useContext, createContext } from "react"

import "./App.css"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import { MantineProvider, ColorSchemeScript, Container, Card } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/index.jsx"
import Wallet from "./pages/Wallet/index.jsx"
import Create from "./pages/Wallet/Create.jsx"
import Import from "./pages/Wallet/Import.jsx"
import Profile from "./pages/Profile/index.jsx"
import Transfer from "./pages/Transfer/index.jsx"
import TransferToken from "./pages/Transfer/token.jsx"
import useGetAccount from './hooks/useGetAccount.js'

export const globalContext = createContext({})
function App() {
    const [account, setAccount] = useGetAccount()
    return (
        <globalContext.Provider value={{ account, setAccount }}>
            <ColorSchemeScript forceColorScheme="dark" />
            <MantineProvider forceColorScheme="dark">
                <Notifications />
                <BrowserRouter>
                    <Card shadow="lg" padding="lg" radius="md" withBorder className="main-container">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/wallet" element={<Wallet />} />
                            <Route path="/wallet/create" element={<Create />} />
                            <Route path="/wallet/import" element={<Import />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/transfer" element={<Transfer />} />
                            <Route path="/transfer/:token" element={<TransferToken />} />
                        </Routes>
                    </Card>
                </BrowserRouter>
            </MantineProvider>
        </globalContext.Provider>
    )
}

export default App