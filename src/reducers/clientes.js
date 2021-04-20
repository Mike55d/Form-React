const clientes = (state = [], action) => {
	switch (action.type) {
		case 'ADD_CLIENTE':
			return [...state,action.payload]
		case 'EDIT_CLIENTE':
			return action.payload;
		case 'DELETE_CLIENTE':
			return action.payload;
		default:
			return state;
	}
}

export default clientes;