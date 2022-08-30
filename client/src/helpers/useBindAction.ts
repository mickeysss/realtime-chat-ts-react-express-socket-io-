import axios from 'axios'
import { socket } from '../socket'
import { JOINTYPE } from '../reducer'
import { IActions, RoomObj, Message } from './types'
import { initialValue } from './StoreContext'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const useBindAction = (dispatch: React.Dispatch<any>): IActions => {
    const navigate = useNavigate()

    const setRooms = () => {
        axios.get('/rooms').then((response) => {
            dispatch({
                type: 'SET_ROOMS',
                payload: response.data,
            })
        })
    }

    const setUsers = (users: string[]) => {
        dispatch({
            type: 'SET_USERS',
            payload: users,
        })
    }

    const addMessage = (message: Message) => {
        dispatch({
            type: 'SET_MESSAGES',
            payload: message,
        })
    }

    const onLogin = async (obj: { roomObj: RoomObj; userName: string }) => {
        dispatch({
            type: 'ENTERED',
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
        dispatch({
            type: 'SET_ADMIN',
            payload: true,
        })
    }

    const setRemoved = (data: JOINTYPE) => {
        dispatch({
            type: 'SET_REMOVED',
            payload: data,
        })
    }

    const sendRemoveEvent = (roomObj: RoomObj) => {
        socket.emit('ROOM:DELETE_ADMIN', { roomObj, deleteRoom: true })
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

    return {
        handleResetAdmin,
        sendRemoveEvent,
        setRemoved,
        setAdmin,
        onLogin,
        addMessage,
        setRooms,
        setUsers,
    }
}
