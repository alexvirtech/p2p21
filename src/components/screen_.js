import { useEffect, useRef, useState, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import Peer from "peerjs"

const Screen = () => {
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const { state, dispatch } = useContext(Context)
    const { peer, conn, call } = state

    useEffect(() => {
        if (!peer) return

        peer.on("call", (incomingCall) => {
            incomingCall.answer()
            incomingCall.on("stream", (remoteStream) => {
                conn.on("data", (data) => {
                    if (data.type === "screen") {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream
                        }
                    }
                })
            })
            dispatch({ type: "SET_CALL", payload: incomingCall })
        })

        return () => {
            peer.off("call")
        }
    }, [peer, dispatch])

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }

            if (peer && conn) {
                conn.send({ type: "screen" })
                const outgoingCall = peer.call(conn.peer, stream)
                outgoingCall.on("stream", (remoteStream) => {
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = remoteStream
                    }
                })
                dispatch({ type: "SET_CALL", payload: outgoingCall })
            }
        } catch (error) {
            console.error("Error sharing screen:", error)
        }
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex justify-around w-full p-2">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={startScreenShare}
                >
                    Share Screen
                </button>
            </div>
            <div className="w-full">
                <div class="w-full p-2">
                    {/*  <h2 class="">My Screen</h2> */}
                    <video ref={localVideoRef} autoPlay className="w-full h-auto "></video>
                </div>
                {/* <div className="w-full p-2">
                    <h2 className="text-center text-lg">Remote Screen</h2>
                    <video ref={remoteVideoRef} autoPlay className="w-full h-auto border border-gray-400 rounded"></video>
                </div> */}
            </div>
        </div>
    )
}

export default Screen
