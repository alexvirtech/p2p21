import { useReducer, useState, useEffect } from "preact/hooks"
import { Context } from "./utils/context"
import { InitState, reducer } from "./utils/reducer"
import Chat from "./components/chat"
import Video from "./components/video"
import Status from "./components/status"
import Caller from "./components/caller"
import { usePeer } from "./hooks/usePeer"
import Whiteboard from "./components/whiteboard"
import { useControl } from "./hooks/useControl"

export function App() {
    const [state, dispatch] = useReducer(reducer, InitState)
    const { peer, connect, disconnect } = usePeer(null, dispatch, state)
    const { isControlled, passControl } = useControl()
    const tabs = ["Dashboard", "Screen", "Whiteboard", "Documents"]
    const [tab, setTab] = useState(tabs[0])

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
        if (tab === "Screen") {
            startScreenShare()
        } else {
            closeScreenShare()
        }
    }, [tab])

    return (
        <Context.Provider value={{ state, dispatch }}>
            <div class="h-[100vh] flex flex-col">
                <div class="border-b border-gray-500 px-4">
                    <h1 class="text-2xl flex justify-center py-4">Communicator</h1>
                </div>

                <div class="grow flex justify-center gap-0">
                    <div class="p-4 grow flex flex-col min-h-0 max-w-[420px]">
                        <Caller />
                        <div class="grid grid-cols-2 gap-2 py-4 h-[200px]">
                            <div class="border border-gray-400 rounded p-2 pt-0">
                                <Video stream={state.localStream} name="my video" />
                            </div>
                            <div class="border border-gray-400 rounded p-2 pt-0">
                                {state.remoteStream ? <Video stream={state.remoteStream} name={"User 2"} /> : <div>not connected</div>}
                            </div>
                        </div>
                        <Chat />
                    </div>

                    <div class="w-full py-4 pr-4 flex flex-col max-w-[1000px]">
                        <div class="flex justify-start gap-4">
                            {tabs.map((t) => (
                                <button
                                    onClick={() => setTab(t)}
                                    class={"font-bold " + (t === tab ? "text-gray-700" : "text-blue-500 hover:underline")}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div class="grow border border-gray-400 rounded p-4">
                            {tab==='Screen' && <Video stream={state.tempStream} />}
                            {tab==='Whiteboard' && <Whiteboard />}
                           {/*  {isControlled && <button onClick={passControl}>Pass Control</button>} */}
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t border-gray-400">
                    <Status isConnected={state.remoteStream} />
                </div>
            </div>
        </Context.Provider>
    )
}
