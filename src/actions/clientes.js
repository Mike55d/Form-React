export const addCliente = (cliente) =>({
  type:'ADD_CLIENTE',
	payload:cliente,
})

export const editarCliente = (newState) =>({
	type:'EDIT_CLIENTE',
	payload:newState
})

export const delCliente = (newState) =>({
  type:'DELETE_CLIENTE',
	payload:[...newState]
})