import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Collapse, Form, Input, Select } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import Title from 'antd/lib/typography/Title'
import { ToastContainer, toast } from 'react-toastify'
import { socket } from '../../socket'
import 'react-toastify/dist/ReactToastify.css'
import 'react-toastify/dist/ReactToastify.minimal.css'
import { AuthContainer } from './styles/styles'
import logoCompany from '../../assets/svg/logo-company.svg'
import { useAction, useStore } from '../../helpers/StoreContext'

const { Option } = Select

export const Auth = (): React.ReactElement => {
    const [rooms, setRooms] = useState([
        {
            roomName: '',
            roomId: '',
        },
    ])
    const [clicked, setClicked] = useState(false)
    const [values, setValues] = useState({
        userName: '',
        rooms: [],
        newRoom: '',
        selectedRoom: '',
    })

    const { removedChat } = useStore()
    const { onLogin } = useAction()

    const navigate = useNavigate()

    const handleSelectChange = (value: string) => {
        setValues({ ...values, selectedRoom: value })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        if (values.newRoom) {
            setValues({ ...values, selectedRoom: '' })
        }
    }, [values.newRoom])

    const handleValidation = () => {
        const { userName, newRoom, selectedRoom } = values
        if (userName.length < 3) {
            toast.error('Имя пользователя должно содержать не менее 3 букв')
            return false
        } else if (!newRoom && !selectedRoom) {
            toast.error('Выберите комнату для продолжения')
            return false
        } else if (!selectedRoom && newRoom.length < 3) {
            toast.error('Название комнаты должно содержать не менее 3 букв .')
            return false
        }
        return true
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        if (handleValidation()) {
            const { newRoom, userName, selectedRoom } = values
            const roomObj = newRoom
                ? { roomName: newRoom, roomId: userName }
                : rooms.filter(
                      (room) => room !== null && room.roomName === selectedRoom
                  )[0]
            const obj = {
                roomObj,
                userName,
            }
            await axios
                .post('/rooms', { roomObj, userName })
                .then(() => {
                    onLogin(obj)
                    socket.on('ROOMS', setRooms)
                })
                .catch((e) => console.log(e))
            navigate('/rooms')
        }
    }

    if (removedChat) {
        toast.error('Админ удалил чат')

        setTimeout(() => {
            navigate('/')
            document.location.reload()
        }, 3000)
    }

    const onRooms = () => {
        try {
            axios
                .get('/rooms')
                .then((response) => {
                    setRooms(response.data)
                    setClicked(!clicked)
                })
                .catch((e) => console.log(e))
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!clicked) {
            onRooms()
        }
    }, [rooms, onLogin])

    if (removedChat) {
        toast.error('Название комнаты должно содержать не менее 3 букв .')
    }

    return (
        <>
            <AuthContainer>
                <Form className={'formContainer'}>
                    <div className="brand">
                        <img src={logoCompany} alt="logo" />
                    </div>
                    <div>
                        <Title className="room-title">Логин</Title>
                        <Input
                            type="text"
                            placeholder="Введите логин"
                            name="userName"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div>
                        <Title className="room-title">Чат-комната</Title>
                        <div className="selectWrapper">
                            <Select
                                value={values.selectedRoom}
                                placeholder="Выберите чат-комнату"
                                showArrow={true}
                                className="room-selector"
                                disabled={!!values.newRoom}
                                onChange={(e) => handleSelectChange(e)}
                            >
                                {[...rooms]
                                    .filter((room) => room !== null)
                                    .map((room, key) => (
                                        <Option
                                            key={key}
                                            name={room.roomName}
                                            value={room.roomName}
                                        >
                                            <div>
                                                <span>{room.roomName}</span>
                                            </div>
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                    </div>
                    <Title style={{ margin: '0 auto' }} className="room-title">
                        или
                    </Title>
                    <Collapse>
                        <CollapsePanel
                            className="collapse-btn"
                            header="Создайте комнату"
                            key={''}
                        >
                            <Input
                                type="text"
                                placeholder="Придумайте название комнаты"
                                name="newRoom"
                                onChange={(e) => handleChange(e)}
                            />
                        </CollapsePanel>
                    </Collapse>

                    <Button
                        onClick={(event) => handleSubmit(event)}
                        size="large"
                        type="ghost"
                    >
                        Присоединится к чату
                    </Button>
                </Form>
            </AuthContainer>
            <ToastContainer />
        </>
    )
}
