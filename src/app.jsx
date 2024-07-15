import { useState, useEffect, useRef } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig1 } from "./utils/config"

export function App() {
    const [myId, setMyId] = useState()
    const [recId, setRecId] = useState()
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [localStream, setLocalStream] = useState(null)
    const myVideo = useRef(null)
    const repVideo = useRef(null)
    const messages = useRef(null)
    const input = useRef(null)
    const connectButton = useRef(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        init()
    }, [])

    // Initialize my video stream and create a new Peer with a generated ID
    const init = async () => {
        try {
            //const myVideo = document.getElementById("myVideo")
            const ls = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            setLocalStream(ls)
            myVideo.current.srcObject = ls

            setPeer(new Peer(peerConfig1))
        } catch (error) {
            console.error("Error accessing media devices.", error)
        }
    }

    useEffect(() => {
        if (peer) {
            peer.on("open", (id) => {
                setMyId(id)
                console.log("Peer ID:", id)
            })

            // Handle incoming calls
            peer.on("call", (incomingCall) => {
                console.log("Receiving call...")
                incomingCall.answer(localStream)
                incomingCall.on("stream", (remoteStream) => {
                    const repVideo = document.getElementById("repVideo")
                    repVideo.current.srcObject = remoteStream
                })
            })

            // Handle incoming data connections
            peer.on("connection", (connection) => {
                setConn(connection)
                conn.on("data", (data) => {
                    console.log("Received:", data)
                    addMessage(data, false)
                })
                conn.on("open", () => {
                    console.log("Connection opened")
                    recId = connection.peer
                    updateUIForConnectedState()
                })
            })
        }
    }, [peer])

    // Connect to the recipient peer
    const connect = async (e) => {
        e.preventDefault()

        if (!peer) {
            console.error("Peer not initialized.")
            return
        }

        setConn(peer.connect(recId))
        conn.on("open", () => {
            console.log("Connected to:", recId)
            updateUIForConnectedState()

            // Set up data connection handler
            conn.on("data", (data) => {
                console.log("Received:", data)
                addMessage(data, false)
            })

            // Make a call to the recipient
            setCall(peer.call(recId.current.value, localStream))
            call.on("stream", (remoteStream) => {
                //const repVideo = document.getElementById("repVideo")
                repVideo.current.srcObject = remoteStream
            })
        })

        conn.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }

    // Disconnect the peer connection
    const disconnect = () => {
        if (call) call.close()
        if (conn) conn.close()
        if (peer) peer.destroy()

        //document.getElementById("recId").readOnly = false
        //document.getElementById("connectButton").innerText = "Connect"
        //document.getElementById("connectButton").onclick = (e) => connect(e)
        //document.getElementById("messages").style.display = "none"
        //document.getElementById("statusBar").innerText = "not connected"
        //document.getElementById("myVideo").srcObject = null
        //messages.current.style.display = "none"
        setRecId("")
        myVideo.current.srcObject = null
        repVideo.current.srcObject = null
        setIsConnected(false)
        //document.getElementById("repVideo").srcObject = null

        init()
    }

    // Send chat messages
    const send = (e) => {
        e.preventDefault()
        const chatMessage = input.current.value
        if (conn && conn.open) {
            conn.send(chatMessage)
            input.current.value = ""
            addMessage(chatMessage, true)
        } else {
            console.log("Connection is not open.")
        }
    }

    const getId = (e) => {
        e.target.select()
    }

    const addMessage = (message, isMine) => {
        const chatItem = `<div class="${isMine ? "text-left pr-12" : "text-right pl-12"}">${message}</div>`
        messages.current.insertAdjacentHTML("beforeend", chatItem)
        messages.current.scrollTop = messages.current.scrollHeight
    }

    return (
        <div class="max-w-[500px] mx-auto">
            <div>
                <h1 class="text-2xl flex justify-center py-4">Communicator</h1>
                <form id="connectForm" onSubmit={connect}>
                    <div class="w-full">
                        <div>My Nickname</div>
                        <input
                            type="text"
                            class="border border-gray-400 p-2 rounded w-full"
                            value={myId}
                            onClick={getId}
                            readonly
                        />
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

                <div class="flex justify-center gap-2 py-4 px-1">
                    <video autoplay muted ref={myVideo} class="max-w-[50%] border border-gray-400 p-2 rounded"></video>
                    <video autoplay ref={repVideo} class="max-w-[50%] border border-gray-400 p-2 rounded"></video>
                </div>

                {isConnected && (
                    <div class="flex flex-col w-full" style="display:none">
                        <form onsubmit={send}>
                            <div
                                class="grow border border-gray-400 w-full h-60 mb-4 rounded overflow-y-auto overflow-x-hidden px-4 py-2"
                                id="allMessages"
                            ></div>
                            <div class="flex justify-between gap-2">
                                <input type="text" class="border border-gray-400 p-2 rounded grow" id="chatMessage" />
                                <button
                                    type="submit"
                                    class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    id="sendButton"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            <div class="text-center">{isConnected ? "Connected" : "Not connected"}</div>
        </div>
    )
}
