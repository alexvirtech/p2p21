import { useReducer, useEffect } from "preact/hooks"
import Layout from "./layouts/layout"
import { InitState, reducer } from "./utils/reducer"
import { usePeer } from "./hooks/usePeer"
import { useControl } from "./hooks/useControl"
import Video from "./components/video"
import Whiteboard from "./components/whiteboard"
import Documents from "./components/documents"
import Templates from "./components/templates"
import Braude from "./components/braude"
import Router, { route } from 'preact-router'
import Start from './pages/start'
import Basic from './pages/basic'
import Advanced from './pages/advanced'
import Contacts from './pages/contacts'
import Groups from './pages/groups'
import Projects from './pages/projects'
import History from './pages/history'
import Account from './pages/account'
import Settings from './pages/settings'
import { getAccounts } from "./utils/localDB"

export function App() {
    const [state, dispatch] = useReducer(reducer, InitState)
    //const { peer, connect, disconnect } = usePeer(null, dispatch, state)
    //const { isControlled, passControl } = useControl()

    useEffect(() => {
        const withClear = false // true is for development, must be false in production
        const acc = getAccounts(withClear)
        dispatch({ type: "SET_ACCOUNTS", payload: acc })
    }, [])

  /*   const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            dispatch({ type: "SET_TEMP_STREAM", payload: screenStream })

            if (state.peer && state.conn) {
                state.conn.send({ type: "screen" }) // Send a message indicating screen share
                const outgoingCall = state.peer.call(state.conn.peer, screenStream)
                outgoingCall.on("stream", (remoteStream) => {
                    dispatch({ type: "SET_CALL", payload: outgoingCall })
                })
            }
        } catch (error) {
            console.error("Error starting screen share:", error)
        }
    }

    const closeScreenShare = () => {
        if (state.tempStream) {
            // Stop all tracks of the screen share stream
            state.tempStream.getTracks().forEach((track) => track.stop())
        }

        if (state.conn) {
            // Notify the remote peer to stop screen sharing
            state.conn.send({ type: "stopScreen" })
        }

        dispatch({ type: "SET_TEMP_STREAM", payload: null })
    }

    useEffect(() => {
        if (state.remoteStream) {
            console.log("Remote Stream: ", state.remoteStream)
        }
    }, [state.remoteStream])

    useEffect(() => {
        if (state.tab === "Screen" && !state.isReceiver) {
            startScreenShare()
        } else if (!state.isReceiver) {
            closeScreenShare()
        }
    }, [state.tab])
 */
    useEffect(() => {
        const u = state.page.toLowerCase()        
        route(`${u === 'start' ? '/' : `/${u}`}`)
    },[state.page])

    return (
        <Layout state={state} dispatch={dispatch}>
            <Router>
                <Start path="/" />
                <Basic path="/basic" />
                <Advanced path="/advanced" />
                <Contacts path="/contacts" />
                <Groups path="/groups" />
                <Projects path="/projects" />
                <History path="/history" />
                <Account path="/account" />
                <Settings path="/settings" />
            </Router>
            {/* {!state.template && <Templates />}
            {state.template === 'braude' && <Braude />}
            {state.tab === "Screen" && <Video stream={state.tempStream} />}
            {state.tab === "Whiteboard" && <Whiteboard />}
            {state.tab === "Documents" && <Documents />}        */}    
        </Layout>
    )
}
