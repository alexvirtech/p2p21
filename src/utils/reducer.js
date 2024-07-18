export const InitState = {
    localStream: null,
    remoteStream: null,
    tempStream: null,
    peer: null,
    conn: null,
    call: null,
    messages: [],
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_PEER":
            if (action.payload.remoteStream && state.remoteStream && state.remoteStream.id !== action.payload.remoteStream.id) {
                return { ...state, tempStream:action.payload.remoteStream }
            } else {
                return { ...state, ...action.payload }
            }
        case "SET_CALL":
            return { ...state, call: action.payload }
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] }
        case "SET_TEMP_STREAM":
            return { ...state, tempStream: action.payload }
        default:
            return state
    }
}
