const reducer = (state: any, action: any) => {
	switch (action.type) {
		case 'JOINED':
			return {
				...state,
				joined: true,
				userName: action.payload.userName,
				roomName: action.payload.roomName,
				roomObj: action.payload.roomObj,
			};

		case 'SET_DATA':
			return {
				...state,
				users: action.payload.users,
				messages: action.payload.messages,
			};

		case 'SET_USERS':
			return {
				...state,
				users: action.payload
			};

		case 'SET_MESSAGES':
			return {
				...state,
				messages: [...state.messages, action.payload]
			};

		case 'SET_ROOMS':
			return {
				...state,
				rooms: [...state.rooms, action.payload.roomObj.roomName]
			};

		case 'SET_ADMIN':
			return {
				...state,
				isAdmin: action.payload
			};
		case 'SET_REMOVED':
			return {
				...state,
				removedChat: action.payload
			};
		default:
			return state;
	}
};

export default reducer;