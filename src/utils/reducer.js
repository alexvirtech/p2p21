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
        case "INIT":
            return { ...state, peer: action.payload.peer, localStream: action.payload.stream }       
        case "SET_REMOTE_STREAM":
            return { ...state, remoteStream: action.payload }
        case "REM_REMOTE_STREAM":
            return { ...state, remoteStream: null }
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] }
        case "SET_CALL":
            return { ...state, call: action.payload }
        case "SET_CONN":
            return { ...state, conn: action.payload }
        default:
            return state
    }
}
