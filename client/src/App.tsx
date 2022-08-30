import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Auth } from './pages/Auth'
import { ChatRoom } from './pages/ChatRoom'
import { useAction, useStore } from './helpers/StoreContext'
import 'antd/dist/antd.css'
import { socket } from './socket'

const App = (key: string) => {
    const state = useStore()
    const {
        setUsers,
        addMessage,
        setRooms,
        setAdmin,
        setRemoved,
        handleResetAdmin,
    } = useAction()

    useEffect(() => {
        socket.on('ROOM:SET_USERS', setUsers)
        socket.on('ROOM:NEW_MESSAGE', addMessage)
        socket.on('ROOMS', setRooms)
        socket.on('ROOM:ADMIN_ENTERED', setAdmin)
        socket.on('ROOM:REMOVED', setRemoved)
    }, [])

    useEffect(() => {
        handleResetAdmin()
    }, [state.isAdmin])

    return (
        <>
            {!state.isEntered ? (
                <Routes>
                    <Route path="/" element={<Auth />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path="rooms" element={<ChatRoom />} />
                </Routes>
            )}
        </>
    )
}

export default App
