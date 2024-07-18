import { useReducer, useEffect } from "preact/hooks"
import { Context } from "./utils/context"
import { InitState, reducer } from "./utils/reducer"
import Chat from "./components/chat"
import Video from "./components/video"
import Status from "./components/status"
import Caller from "./components/caller"
import { usePeer } from "./hooks/usePeer"

export function App() {
    const [state, dispatch] = useReducer(reducer, InitState)
    const { peer, connect, disconnect } = usePeer(null, dispatch, state)

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            dispatch({ type: "SET_TEMP_STREAM", payload: screenStream })

            if (state.peer && state.conn) {
                state.conn.send({ type: "screen" }) // Send a message indicating screen share
                const outgoingCall = state.peer.call(state.conn.peer, screenStream)
                outgoingCall.on("stream", (remoteStream) => {
                    if (remoteScreenRef.current) {
                        remoteScreenRef.current.srcObject = remoteStream
                    }
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

    return (
        <Context.Provider value={{ state, dispatch }}>
            <div class="h-[100vh] flex flex-col">
                <div class="border-b border-gray-500 px-4">
                    <h1 class="text-2xl flex justify-center py-4">Communicator</h1>
                </div>

                <div class="grow flex justify-start gap-0">
                    <div class="p-4 grow flex flex-col min-h-0 max-w-[420px]">
                        <Caller />
                        <div class="grid grid-cols-2 gap-2 py-4 h-[200px]">
                            <Video stream={state.localStream} name="my video" />
                            <Video stream={state.remoteStream} name={"User 2"} />
                        </div>
                        <Chat />
                    </div>

                    <div class="w-[600px] pb-4 pt-2 pr-4 h-full flex flex-col">
                        <div className="flex justify-center gap-2 w-full p-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={startScreenShare}
                            >
                                Share Screen
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={closeScreenShare}
                            >
                                Close
                            </button>
                        </div>
                        <div>
                            <div class="flex justify-start gap-4">
                                <div class="">Dashboard</div>
                                <div class="">Screen</div>
                                <div>Whiteboard</div>
                                <div>Documents</div>
                            </div>
                            <div class="grow border border-gray-400 rounded">
                                <Video stream={state.tempStream} />
                            </div>
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
