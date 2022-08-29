import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { socket } from '../../socket'
import { useAction } from '../../helpers/StoreContext'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Button, Collapse } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { ChatContainer } from './styles/styles'

export interface IChatRoom {
    isAdmin: boolean
    userName: string
    roomObj: { [key: string]: string }
    users: string[]
    messages: { [key: string]: string }[]
    addMessage: (p: { text: string; userName: string }) => {
        [p: string]: string
    }
    removedChat: boolean
}

export const ChatRoom = ({
    isAdmin,
    userName,
    roomObj,
    users,
    messages,
    addMessage,
    removedChat,
}: IChatRoom) => {
    const [messageValue, setMessageValue] = useState('')
    const messagesRef = useRef<null | HTMLDivElement>(null)
    const navigate = useNavigate()
    const { sendRemoveEvent } = useAction()
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

    return (
        <ChatContainer>
            <div className="flex-container">
                <div>
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
        </ChatContainer>
    )
}
