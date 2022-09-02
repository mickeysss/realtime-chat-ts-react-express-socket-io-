import { State, ActionType } from './helpers/types'

const reducer = (state: State, action: ActionType): State => {
    switch (action.type) {
        case 'ENTERED':
            return {
                ...state,
                ...action.payload,
                isEntered: true,
            }

        case 'REMOVE_ROOM': {
            return {
                ...state,
                ...action.payload,
            }
        }

        case 'SET_DATA':
            return {
                ...state,
                users: action.payload.users,
                messages: action.payload.messages,
            }

        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            }

        case 'SET_MESSAGES':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }

        case 'SET_ROOMS':
            return {
                ...state,
                rooms: [...state.rooms, action.payload.roomObj.roomName],
            }

        case 'SET_ADMIN':
            return {
                ...state,
                isAdmin: action.payload,
            }
        case 'SET_REMOVED':
            return {
                ...state,
                rooms: [
                    ...state.rooms.filter(
                        (room: string) =>
                            room !== action.payload.roomObj.roomName
                    ),
                ],
                removedChat: action.payload.deletedRemoved,
            }
        default:
            return state
    }
}

export default reducer
