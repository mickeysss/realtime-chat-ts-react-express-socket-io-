import { JOINTYPE } from '../reducer'

export type RoomObj = {
    roomName?: string
    roomId?: string
}

export type Message = {
    userName: string
    text: string
}

export type State = {
    isEntered: boolean
    userName: string
    roomName: string
    users: string[]
    messages: Message[]
    rooms: string[]
    roomObj: RoomObj
    isAdmin: boolean
    removedChat: boolean
}

export type IActions = {
    sendRemoveEvent: (roomObj: RoomObj) => void
    setRemoved: (data: JOINTYPE) => void
    setAdmin: () => void
    onLogin: (obj: { roomObj: RoomObj; userName: string }) => void
    addMessage: (message: Message) => void
    setUsers: (users: string[]) => void
    setRooms: (roomObj: State) => void
    handleResetAdmin: () => void
}
