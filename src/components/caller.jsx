import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"

export default function Caller() {
    const { state, dispatch } = useContext(Context)
    const [myId, setMyId] = useState("")
    const [recId, setRecId] = useState("")
    const connectButton = useRef(null)
    const [isConnected, setIsConnected] = useState(false) 

    useEffect(() => {
        init()
    }, [])

    // Initialize my video stream and create a new Peer with a generated ID
    const init = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            const peer = new Peer(peerConfig)            
            dispatch({ type: "INIT", payload: { peer,stream }})
        } catch (error) {
            console.error("Error accessing media devices.", error)
        }
    }

    useEffect(() => {
        if (state.peer) {
            state.peer.on("open", (id) => {
                setMyId(id)
                console.log("Peer ID:", id)
            })

            // Handle incoming calls
            state.peer.on("call", (incomingCall) => {
                console.log("Receiving call...")
                incomingCall.answer(state.localStream)
                incomingCall.on("stream", (remStream) => {
                    dispatch({ type: "SET_REMOTE_STREAM", payload: remStream })
                })                
            })

            // Handle incoming data connections
            state.peer.on("connection", (connection) => {
                connection.on("open", () => {
                    console.log("Connection opened")
                    setRecId(connection.peer)
                })
                dispatch({ type: "SET_CONN", payload: connection })
            })

            state.peer.on("error", (err) => {
                console.error("Peer error:", err)
            })
        }
    }, [state.peer])

    useEffect(() => {
        if (!state.conn) return
        state.conn.on("open", () => {
            console.log("Connected to:", recId)

            // Set up data connection handler
            state.conn.on("data", (data) => {
                console.log("Received:", data)
                dispatch({ type: "ADD_MESSAGE", payload: { message: data, isMine: false } })
            })

            // Handle data connection close event
            state.conn.on("close", () => {
                console.log("Data connection closed by the remote peer")
                disconnect()
            })

            // Make a call to the recipient
            dispatch({ type: "SET_CALL", payload: state.peer.call(recId, state.localStream) })

            setIsConnected(true)
        })

        state.conn.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }, [state.conn])

    useEffect(() => {
        if (!state.call) return
        state.call.on("stream", (remStream) => {           
            dispatch({ type: "SET_REMOTE_STREAM", payload: remStream })
        })

        state.call.on("close", () => {
            console.log("Call closed by the remote peer")
            disconnect()
        })

        state.call.on("error", (err) => {
            console.error("Call error:", err)
        })
    }, [state.call])
    
    // Connect to the recipient peer
    const connect = async (e) => {
        e.preventDefault()

        if (!state.peer) {
            console.error("Peer not initialized.")
            return
        }

        //setConn(peer.connect(recId))
        dispatch({ type: "SET_CONN", payload: state.peer.connect(recId) })
    }

    // Disconnect the peer connection
    const disconnect = () => {
        if (state.call) state.call.close()
        if (state.conn) state.conn.close()
        setRecId("")
        dispatch({ type: "REM_REMOTE_STREAM" })
        setIsConnected(false)
    }

    const getId = (e) => {
        e.target.select()
    }

    return (
        <form onSubmit={connect}>
            <div class="w-full">
                <div>My Nickname</div>
                <input type="text" class="border border-gray-400 p-2 rounded w-full" value={myId} onClick={getId} readonly />
            </div>

            <div class="w-full">
                <div>Recipient</div>
                <input
                    type="text"
                    class="border border-gray-400 p-2 rounded w-full"
                    readOnly={isConnected}
                    value={recId}
                    onChange={(e) => setRecId(e.target.value)}
                />
            </div>
            <div class="py-2">
                <button
                    type="submit"
                    class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-[9px] px-4 rounded"
                    ref={connectButton}
                    onClick={isConnected ? disconnect : connect}
                >
                    {isConnected ? "Disconnect" : "Connect"}
                </button>
            </div>
        </form>
    )
}
