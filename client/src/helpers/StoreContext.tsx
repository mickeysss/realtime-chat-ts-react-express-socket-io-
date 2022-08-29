import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import reducer, { JOINTYPE } from '../reducer'
import { socket } from '../socket'

export const useStore = () => useContext(StoreContext)
export const useAction = () => useContext(ActionContext)

export interface IInitialValue {
    joined: boolean
    userName: string
    roomName: string
    users: never[]
    messages: never[]
    rooms: never[]
    roomObj: { [key: string]: string }
    isAdmin: boolean
    removedChat: boolean
}

export const initialValue = {
    joined: false,
    userName: '',
    roomName: '',
    users: [],
    messages: [],
    rooms: [],
    roomObj: {},
    isAdmin: false,
    removedChat: false,
}

export interface IActions {
    sendRemoveEvent: (roomObj: { [p: string]: string }) => void
    setRemoved: () => void
    setAdmin: () => void
    onLogin: (obj: {
        roomObj: { roomName: string; roomId: string }
        userName: string
    }) => Promise<void>
    addMessage: (p: { text: string; userName: string }) => {
        [p: string]: string
    }
    setUsers: () => void
    setRooms: () => void
    handleResetAdmin: () => void
}

const StoreContext = createContext<IInitialValue>(initialValue)
const ActionContext = createContext<IActions>({} as IActions)

export const StoreContextProvider: React.FC = ({ children }) => {
    const navigate = useNavigate()

    const [state, dispatch] = useReducer(reducer, initialValue)
    const setRooms = () => {
        axios.get('/rooms').then((response) => {
            dispatch({
                type: 'SET_ROOMS',
                payload: response.data,
            })
            console.log('set rooms', response.data)
        })
    }

    const setUsers = (users: string | boolean | (() => void)) => {
        dispatch({
            type: 'SET_USERS',
            payload: users,
        })
    }

    const addMessage = (message: string) => {
        dispatch({
            type: 'SET_MESSAGES',
            payload: message,
        })
    }

    const onLogin = async (obj: string | boolean | (() => void)) => {
        dispatch({
            type: 'JOINED',
            payload: obj,
        })
        socket.emit('ROOM:JOIN', obj)
        const { data } = await axios.get(`/rooms/${obj.roomObj.roomName}`)
        dispatch({
            type: 'SET_DATA',
            payload: data,
        })
    }

    const setAdmin = () => {
        const isAdmin = true
        dispatch({
            type: 'SET_ADMIN',
            payload: isAdmin,
        })
    }

    const setRemoved = (data: JOINTYPE) => {
        dispatch({
            type: 'SET_REMOVED',
            payload: data,
        })
    }

    const sendRemoveEvent = (roomObj: IInitialValue) => {
        const deleteRoom = true
        socket.emit('ROOM:DELETE_ADMIN', { roomObj, deleteRoom })
        dispatch({
            type: 'REMOVE_ROOM',
            payload: initialValue,
        })
        navigate('/')
    }

    const handleResetAdmin = () => {
        setTimeout(() => {
            dispatch({
                type: 'SET_ADMIN',
                payload: false,
            })
        }, 0)
    }

    useEffect(() => {
        socket.on('ROOM:SET_USERS', setUsers)
        socket.on('ROOM:NEW_MESSAGE', addMessage)
        socket.on('ROOMS', setRooms)
        socket.on('ROOM:ADMIN_ENTERED', setAdmin)
        socket.on('ROOM:REMOVED', setRemoved)
    }, [])

    return (
        <StoreContext.Provider value={{ ...state }}>
            <ActionContext.Provider
                value={
                    {
                        sendRemoveEvent,
                        setRemoved,
                        setAdmin,
                        onLogin,
                        addMessage,
                        setUsers,
                        setRooms,
                        handleResetAdmin,
                    } as unknown as IActions
                }
            >
                {children}
            </ActionContext.Provider>
        </StoreContext.Provider>
    )
}
