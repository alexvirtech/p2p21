export const InitState = {
    localStream: null,
    remoteStream: null,
    peer: null,
    conn: null,
    call: null,
    messages: [],
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_PEER":
            return { ...state, ...action.payload } // peer,conn,call,localStream,remoteStream        
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] }        
        default:
            return state
    }
}
