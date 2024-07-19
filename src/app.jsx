import { useReducer, useEffect } from "preact/hooks"
import Layout from "./components/layout"
import { InitState, reducer } from "./utils/reducer"
import { usePeer } from "./hooks/usePeer"
import { useControl } from "./hooks/useControl"
import Video from "./components/video"
import Whiteboard from "./components/whiteboard"
import Documents from "./components/documents"

export function App() {
    const [state, dispatch] = useReducer(reducer, InitState)
    const { peer, connect, disconnect } = usePeer(null, dispatch, state)
    const { isControlled, passControl } = useControl()

    const startScreenShare = async () => {
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

    return (
        <Layout state={state} dispatch={dispatch}>
            {state.tab === "Screen" && <Video stream={state.tempStream} />}
            {state.tab === "Whiteboard" && <Whiteboard />}
            {state.tab === "Documents" && <Documents />}
            {/* {isControlled && <button onClick={passControl}>Pass Control</button>} */}
        </Layout>
    )
}
