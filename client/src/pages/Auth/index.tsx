import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-toastify/dist/ReactToastify.minimal.css';

import {Button, Collapse, Form, Input, Select} from "antd";
import Title from "antd/lib/typography/Title";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import logoCompany from '../../assets/svg/logo-company.svg'
import axios from "axios";
import {socket} from "../../socket";
import {DeleteFilled, DeleteTwoTone} from "@ant-design/icons";
const { Option } = Select;

interface IAuth{
    onLogin: (obj: any) => Promise<void>
    removedChat: boolean
}

export const Auth = ({onLogin,removedChat}: IAuth): React.ReactElement => {
    const [rooms, setRooms] = useState([{
        roomName: '',
        roomId: ''
    }])
    const [clicked,setClicked] = useState(false)
    const navigate = useNavigate();
    const [values, setValues] = useState({
        userName: "",
        rooms: [],
        newRoom: "",
        selectedRoom: ""
    });

    const handleSelectChange = (value: string) => {
        setValues({...values, selectedRoom: value});
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, [event.target.name]: event.target.value});
    };

    const onChangeCollapse = (key: string | string[]) => {
        console.log(key);
    };

    useEffect(() => {
        if (values.newRoom) {
            setValues({...values, selectedRoom: ''});
        }
    }, [values.newRoom])


    const handleValidation = () => {
        const {userName, rooms, newRoom, selectedRoom} = values;
        if (userName.length < 3) {
            toast.error(
                "Имя пользователя должно содержать не менее 3 букв",
            );
            return false;
        }

            // else if (newRoom.length && !!rooms.filter((room) => room !== null).filter(({roomName}) => roomName as string ===  newRoom)) {
            //                 toast.error("Комната с таким именем уже существует",);
            //                 return false;
        //             }
        else if (!newRoom && !selectedRoom) {
            toast.error("Выберите комнату для продолжения",);
            return false;
        }
        else if (!selectedRoom && newRoom.length < 3) {
            toast.error("Название комнаты должно содержать не менее 3 букв .");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (handleValidation()) {
            const {newRoom, userName, selectedRoom} = values;
            const roomObj = newRoom
                ? {roomName: newRoom, roomId: userName}
                : rooms.filter(room => room !== null && room.roomName === selectedRoom)[0]
            const obj = {
                roomObj,
                userName
            }
            await axios.post("/rooms", {roomObj, userName})
                .then((res) => {
                    onLogin(obj)
                    socket.on('ROOMS', setRooms)

                    console.log(newRoom, userName)
                })
                .catch(e => console.log(e));
            navigate("/rooms");

        }
    }

    if(removedChat) {
        toast.error("Админ удалил чат");

        setTimeout(() => {
            navigate('/')
            document.location.reload();
        },3000)

    }


    const onRooms =  () => {
        try{
            axios.get("/rooms")
                .then((response) => {
                    setRooms(response.data)
                    setClicked(!clicked)
                })
                .catch(e => console.log(e));

        } catch (e){
            console.log(e)
        }

    }

    useEffect(() => {
        socket.on('ROOM:SET_USERS', (users) => {
            console.log('room users', users)
        })},[])

    useEffect(() => {
        if(!clicked) {
            onRooms()
        }
    },[rooms,onLogin]);

    if(removedChat){
        toast.error("Название комнаты должно содержать не менее 3 букв .");
    }

    return (
        <>
            <FormContainer>
                <Form
                    className={"formContainer"}
                >
                    <div className="brand">
                        <img src={logoCompany} alt="logo"/>
                    </div>
                    <div>
                        <Title style={{
                            fontSize: '24px',
                            padding: 0,
                            marginBottom: '10px',
                            color: "lavender"
                        }}>Логин</Title>
                        <Input
                            type="text"
                            placeholder="Введите логин"
                            name="userName"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div>
                        <Title style={{
                            fontSize: '24px',
                            padding: 0,
                            marginBottom: '10px',
                            color: "lavender"
                        }}>Чат-комната</Title>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Select
                                placeholder="Выберите чат-комнату"
                                showArrow={true}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'black'
                                }}
                                disabled={!!values.newRoom}
                                onChange={ (e) => handleSelectChange(e)}
                            >
                                {[...rooms].filter((room) => room !== null).map((room,key) =>(
                                    <>
                                        <Option key={key} name={room.roomName} value={room.roomName}>
                                            <div>
                                                <span>{room.roomName}</span>
                                            </div>
                                        </Option>
                                    </>
                                ))
                                }
                            </Select>
                        </div>
                    </div>
                    <Title style={{
                        fontSize: '24px',
                        padding: 0,
                        marginBottom: '10px',
                        color: "lavender",
                        margin: '0 auto'
                    }}>или</Title>
                    <Collapse onChange={onChangeCollapse}>
                        <CollapsePanel
                            style={{
                                background: 'lavender',
                                outline: '5px',
                                borderRadius: '5px'
                            }}
                            header="Создайте комнату" key={''}>
                            <Input
                                type="text"
                                placeholder="Придумайте название комнаты"
                                name="newRoom"
                                onChange={(e) => handleChange(e)}
                            />
                        </CollapsePanel>

                    </Collapse>

                    <Button onClick={(event) => handleSubmit(event)} size="large" type="ghost">Присоединится к чату</Button>
                </Form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(121, 71, 9, 1) 36%, rgba(89, 21, 74, 1) 75%, rgba(5, 7, 70, 1) 100%);

  option {
    background: black;
    color: wheat;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    margin: 0 auto;
    img {
      height: 5rem;

      svg {
        path{
          fill: #d7be0f;
        }
      }
    }
    h1 {
      text-transform: uppercase;
      color: #d7be0f;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #2a194c;
    border-radius: 2rem;
    padding: 5rem 10rem;
  }

  input {
    padding: .5rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: black;
    font-size: 1rem;
    width: 100%;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    color: white;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;

    &:hover {
      color: white;
      background-color: #ffbb0e;
    }
  }

  span {
    
    a {
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
