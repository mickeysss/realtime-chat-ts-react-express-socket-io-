import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { Button, Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { SendOutlined } from '@ant-design/icons'
import { socket } from '../../socket'
import { useAction, useStore } from '../../helpers/StoreContext'
import { ChatContainer } from './styles/styles'

export const ChatRoom = () => {
    const [messageValue, setMessageValue] = useState('')
    const messagesRef = useRef<null | HTMLDivElement>(null)
    const navigate = useNavigate()
    const { isAdmin, userName, roomObj, users, messages, removedChat } =
        useStore()
    const { sendRemoveEvent, addMessage } = useAction()
    const uniqueUsers = Array.from(new Set(users))

    const { roomName } = roomObj

    const onSendMessage = () => {
        if (messageValue) {
            socket.emit('ROOM:NEW_MESSAGE', {
                userName,
                roomName,
                text: messageValue,
            })
            addMessage({ userName, text: messageValue })
            setMessageValue('')
        }
    }

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTo(0, 99999)
        }
    }, [messages])

    useEffect(() => {
        isAdmin && toast.info('Aдмин вошел в комнату')
    }, [isAdmin])

    useEffect(() => {
        if (removedChat) {
            const promise = Promise.resolve(toast.error('Админ удалил чат'))
            promise.then(() => {
                setTimeout(() => {
                    navigate('/')
                    window.location.reload()
                }, 3000)
            })
        }
    }, [removedChat])

    const onLeaveRoomHandler = () => {
        navigate('/')
        window.location.reload()
    }

    return (
        <ChatContainer>
            <div className="flex-container">
                <div className="room-container">
                    <span>Комната:</span>
                    <h1 className="room-title">{roomObj.roomName}</h1>
                </div>
                {userName === roomObj.roomId && (
                    <Button
                        className="btn-delete"
                        onClick={() => sendRemoveEvent(roomObj)}
                    >
                        Удалить комнату
                    </Button>
                )}
            </div>

            <Collapse className="collapse-container">
                <CollapsePanel
                    className="collapse-panel"
                    header={
                        <>
                            <b>Онлайн ({uniqueUsers.length}):</b>
                        </>
                    }
                    key=""
                >
                    <ul>
                        {uniqueUsers.map((user: string) => (
                            <div key={user} className="flex-container">
                                <li>{user}</li>
                                {user === roomObj.roomId && (
                                    <span>(админ)</span>
                                )}
                                <span className="online-icon" />
                            </div>
                        ))}
                    </ul>
                </CollapsePanel>
            </Collapse>
            <div className="chat-messages">
                <div ref={messagesRef} className="messages">
                    {messages.map((message, index) => (
                        <div
                            className={
                                message.userName === userName
                                    ? 'message-me'
                                    : 'message-other'
                            }
                            key={message.text + index}
                        >
                            <span>
                                {message.userName === userName
                                    ? 'Вы'
                                    : message.userName}
                            </span>
                            <p>{message.text}</p>
                        </div>
                    ))}
                </div>
                <form>
                    <div className="flex-container">
                        <textarea
                            placeholder="Введите текст для отправки"
                            value={messageValue}
                            onChange={(e) => setMessageValue(e.target.value)}
                            className="form-control"
                        />
                        <SendOutlined onClick={onSendMessage} />
                    </div>
                    <ToastContainer />
                </form>
            </div>
            <Button className="btn-delete" onClick={onLeaveRoomHandler}>
                Покинуть комнату
            </Button>
        </ChatContainer>
    )
}
