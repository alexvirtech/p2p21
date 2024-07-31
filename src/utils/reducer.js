export const InitState = {
    accounts: [],
    account: null, //"Default",
    tempAcc: null,
    modal: null,
    page: "Start",
    tabs: ["Dashboard", "Screen", "Whiteboard", "Documents"],
    tab: "Dashboard",
    localStream: null,
    remoteStream: null,
    tempStream: null,
    peer: null,
    conn: null,
    call: null,
    messages: [],
    template: null,
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_ACCOUNTS":
            const selected = action.payload.find(a => a.name === "Default") //temp
            return { ...state, accounts: action.payload, account: selected }
        case "ADD_ACCOUNT":
            return { ...state, accounts: [...state.accounts, action.payload], account: action.payload }
        case "SET_ACCOUNT":
            const acc = state.accounts.find(a => a.name === action.payload.name)
            return { ...state, account: acc }
        case "SET_PAGE":
            return { ...state, page: action.payload }
        case "SET_MODAL":
            return { ...state, modal: action.payload }
        case "SET_TEMPLATE":
            return { ...state, template: action.payload }
        case "SET_PEER":
            if (action.payload.remoteStream && state.remoteStream && state.remoteStream.id !== action.payload.remoteStream.id) {
                return { ...state, tempStream: action.payload.remoteStream }
            } else {
                return { ...state, ...action.payload }
            }
        case "SET_CALL":
            return { ...state, call: action.payload }
        case "SET_TAB":
            if (!action.payload.isReceiver) {
                state.conn?.send({ type: "set_tab", payload: action.payload.tab })
            }
            return { ...state, tab: action.payload.tab, isReceiver: action.payload.isReceiver }
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] }
        case "SET_TEMP_STREAM":
            return { ...state, tempStream: action.payload }
        default:
            return state
    }
}
