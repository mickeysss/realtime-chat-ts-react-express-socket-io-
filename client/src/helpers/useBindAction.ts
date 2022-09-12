import axios from 'axios'
import { socket } from '../socket'
import { Actions, RoomObj, Message, JoinType } from './types'
import { initialValue } from './StoreContext'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const useBindAction = (dispatch: React.Dispatch<any>): Actions => {
    const navigate = useNavigate()

    const setRooms = useCallback(() => {
        axios.get('/rooms').then((response) => {
            console.log(response.data)

            dispatch({
                type: 'SET_ROOMS',
                payload: response.data,
            })
        })
    }, [])

    const setUsers = useCallback((users: string[]) => {
        dispatch({
            type: 'SET_USERS',
            payload: users,
        })
    }, [])

    const addMessage = useCallback((message: Message) => {
        dispatch({
            type: 'SET_MESSAGES',
            payload: message,
        })
    }, [])

    const onLogin = useCallback(
        async (obj: { roomObj: RoomObj; userName: string }) => {
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
        },
        []
    )

    const setAdmin = useCallback(() => {
        dispatch({
            type: 'SET_ADMIN',
            payload: true,
        })
    }, [])

    const setRemoved = useCallback((data: JoinType) => {
        dispatch({
            type: 'SET_REMOVED',
            payload: data,
        })
    }, [])

    const sendRemoveEvent = useCallback((roomObj: RoomObj) => {
        socket.emit('ROOM:DELETE_ADMIN', { roomObj, deleteRoom: true })
        dispatch({
            type: 'REMOVE_ROOM',
            payload: initialValue,
        })
        navigate('/')
    }, [])

    const handleResetAdmin = useCallback(() => {
        setTimeout(() => {
            dispatch({
                type: 'SET_ADMIN',
                payload: false,
            })
        }, 0)
    }, [])

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
