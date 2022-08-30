import React, { createContext, ReactNode, useContext, useReducer } from 'react'
import reducer from '../reducer'
import { IActions, State } from './types'
import { useBindAction } from './useBindAction'

export const useStore = () => useContext(StoreContext)
export const useAction = () => useContext(ActionContext)

export const initialValue: State = {
    isEntered: false,
    userName: '',
    roomName: '',
    users: [],
    messages: [],
    rooms: [],
    roomObj: {},
    isAdmin: false,
    removedChat: false,
}

const StoreContext = createContext(initialValue as State)
const ActionContext = createContext({} as IActions)

export const StoreContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, initialValue)

    return (
        <StoreContext.Provider value={{ ...state }}>
            <ActionContext.Provider value={useBindAction(dispatch)}>
                {children}
            </ActionContext.Provider>
        </StoreContext.Provider>
    )
}
