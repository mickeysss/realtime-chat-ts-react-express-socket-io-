export type RoomObj = {
    roomName: string
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

export type JoinType = Pick<State, 'users' | 'messages' | 'roomObj'> & {
    deletedRemoved: boolean
}

export type Login = Pick<State, 'roomObj' | 'userName'>

export type Actions = {
    sendRemoveEvent: (roomObj: RoomObj) => void
    setRemoved: (data: JoinType) => void
    setAdmin: () => void
    onLogin: (obj: Login) => void
    addMessage: (message: Message) => void
    setUsers: (users: string[]) => void
    setRooms: (roomObj: State) => void
    handleResetAdmin: () => void
}

export type ActionType =
  | { type: 'ENTERED'; payload: Login }
  | { type: 'REMOVE_ROOM'; payload: State }
  | { type: 'SET_DATA'; payload: JoinType }
  | { type: 'SET_USERS'; payload: string[] }
  | { type: 'SET_MESSAGES'; payload: Message }
  | { type: 'SET_ADMIN'; payload: boolean }
  | { type: 'SET_ROOMS'; payload: JoinType }
  | { type: 'SET_REMOVED'; payload: JoinType }
