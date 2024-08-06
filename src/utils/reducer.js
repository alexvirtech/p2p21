import { mode } from "crypto-js"
import { defAccount } from "./common"
import { encrypt, decrypt } from "./crypto"
//import { invType } from "./common"

export const InitState = {
    accounts: [],
    account: null, //defAccount,
    tempAcc: null,
    modal: null,
    mode: null, //
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
    connections: 3,
    isConnected: false,
    isChat: true,
    isVideo: true,
}

export const reducer = (state, action) => {
    switch (action.type) {
        /* account */
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
        case "SET_MODE":
            return { ...state, mode: action.payload }
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
            return { ...state, recipient: action.payload.id, mode: action.payload.tp }
        /* temp */
        case "CONNECT":
            return { ...state, isConnected: action.payload }        
        case "SHOW_CHAT":
            return { ...state, isChat: action.payload }       
            case "SHOW_VIDEO":
                return { ...state, isVideo: action.payload }      
        default:
            return state
    }
}
