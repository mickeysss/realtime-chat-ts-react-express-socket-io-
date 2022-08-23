import React, {useEffect, useReducer, useState} from "react";
import axios from "axios";
import 'antd/dist/antd.css';
import reducer from "./reducer";
import {socket} from "./socket";
import {Auth} from "./pages/Auth";
import {ChatRoom} from "./pages/ChatRoom";
import {Route, Routes, useNavigate} from "react-router-dom";

const App = () => {
    const navigate = useNavigate()

    const [state, dispatch] = useReducer(reducer, {    joined: false,
        userName: '',
        roomName: '',
        users: [],
        messages: [],
        rooms: [],
        roomObj: {},
        isAdmin: false,
        removedChat: false,
    });

    const setRooms = () => {
        axios.get("/rooms")
            .then((response) => {
                dispatch({
                    type: 'SET_ROOMS',
                    payload: response.data,
                });
                console.log('set rooms',response.data)
            })
    }

    const setUsers = (users: any) => {
        dispatch({
            type: 'SET_USERS',
            payload: users,
        });
    };

    const addMessage = (message: any) => {
        dispatch({
            type: 'SET_MESSAGES',
            payload: message,
        });
    };

    const onLogin = async (obj: any) => {
        dispatch({
            type: 'JOINED',
            payload: obj,
        });
        socket.emit('ROOM:JOIN', obj);
        const { data } = await axios.get(`/rooms/${obj.roomObj.roomName}`);
        dispatch({
            type: 'SET_DATA',
            payload: data,
        });

    };

    const setAdmin = () => {
        const isAdmin = true
        dispatch({
            type: 'SET_ADMIN',
            payload: isAdmin,
        })
    }

    const setRemoved = (deleteRoom: any) => {
        dispatch({
            type: 'SET_REMOVED',
            payload: deleteRoom,
        })
    }

    useEffect(() => {
        setTimeout(() => {
            dispatch({
                type: 'SET_ADMIN',
                payload: false,
            })
        },0)
    },[state.isAdmin])

    useEffect(() => {
        socket.on('ROOM:SET_USERS',setUsers);
        socket.on('ROOM:NEW_MESSAGE', addMessage);
        socket.on('ROOMS', setRooms)
        socket.on('ROOM:ADMIN_ENTERED', setAdmin);
        socket.on('ROOM:REMOVED', setRemoved);

    }, []);

    const { roomName } = state.roomObj

    const sendRemoveEvent = () => {
        const deleteRoom = true
        socket.emit('ROOM:DELETE_ADMIN', {roomName,deleteRoom});

        setTimeout(() => {
            navigate('/')
            document.location.reload();
        },3000)


    }
    console.log(state.removedChat)
    return (
        <>
            <Routes>
                {!state.joined
                    ?  <Route path="/" element={<Auth  removedChat={state.removeChat} onLogin={onLogin}/>}/>
                    : <Route  path="rooms" element={<ChatRoom sendRemoveEvent={sendRemoveEvent}  state={state} {...state} addMessage={addMessage}/>}/>
                }
            </Routes>
        </>)

}

export default App;
