import { defAccount } from "./common"
import { encrypt } from "./crypto"

export const InitState = {
    accounts: [],
    account: null, // {name: [account name], wallet: {publicKey: [public key], privateKey: [private key], mnemonic: [mnemonic phrase]}}
    address: null, // my peer id
    recipient: null, // {address: [remote address], publicKey: [remote public key]}
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
    // temp for layout creation
    connections: 1,
    tempConnected: false,
    isConnected: false,
    isChat: false,
    isVideo: true,
    isMonitor: false,
    disconnectExt: false,
    connectExt: null,
}

export const reducer = (state, action) => {
    switch (action.type) {
        /* account */
        case "SET_ADDRESS":
            return { ...state, address: action.payload }
        case "SET_ACCOUNTS":
            const selected = action.payload.find((a) => a.name === defAccount) //temp
            return { ...state, accounts: action.payload, account: selected }
        case "ADD_ACCOUNT":
            return { ...state, accounts: [...state.accounts, action.payload], account: action.payload }
        case "SET_DEF_ACCOUNT":
            const selected2 = action.payload ?? state.accounts.find((a) => a.name === defAccount)
            return { ...state, account: selected2 }
        case "SET_ACCOUNT":
            return { ...state, account: action.payload }
        case "SET_ACCOUNT_BY_NAME":
            const selected4 = state.accounts.find((a) => a.name === action.payload)
            return { ...state, account: selected4 }
        case "DELETE_ACCOUNT":
            if (state.account.name === defAccount) return state
            const updatedAcc = state.accounts.filter((a) => a.name !== state.account.name)
            const selected3 = state.accounts.find((a) => a.name === defAccount)
            return { ...state, accounts: updatedAcc, account: selected3 }
        case "RENAME_ACCOUNT":
            const updatedAcc2 = state.accounts.map((a) => {
                return a.name === state.account.name ? { ...a, name: action.payload } : a
            })
            return { ...state, accounts: updatedAcc2, account: { ...state.account, name: action.payload } }
        case "CHANGE_PASSWORD":
            const { publicKey, privateKey, mnemonic } = state.account.wallet
            const updatedAcc3 = state.accounts.map((a) => {
                return a.name === state.account.name
                    ? { ...a, encWallet: encrypt(JSON.stringify({ publicKey, privateKey, mnemonic }), action.payload) }
                    : a
            })
            return { ...state, accounts: updatedAcc3, account: { ...state.account, name: action.payload } }
        /* page */
        case "SET_PAGE":
            return { ...state, page: action.payload }
        case "SET_MODAL":
            return { ...state, modal: action.payload }        
        case "SET_TEMPLATE": // TBR
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
        case "SET_RECIPIENT":
            return { ...state, recipient: action.payload.recipient }
        case "SET_RECIPIENT_PK":
            return { ...state, recipient: { ...state.recipient, publicKey: action.payload } }
        case "DISCONNECT_EXT":
            return { ...state, disconnectExt: action.payload }
        case "CONNECT_EXT":
            return { ...state, connectExt: action.payload }
        /* temp */
        case "CONNECT":
            return { ...state, isConnected: action.payload }
        case "SHOW_CHAT":
            return { ...state, isChat: action.payload }
        case "SHOW_VIDEO":
            return { ...state, isVideo: action.payload }
        case "SHOW_MONITOR":
            return { ...state, isMonitor: action.payload }
        case "SET_TEMP_CONNECTION":
            return { ...state, tempConnected: action.payload }
        default:
            return state
    }
}
