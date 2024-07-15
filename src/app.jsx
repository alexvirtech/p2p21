import { useState, useEffect, useRef } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig1 } from "./config"

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
            const myVideo = document.getElementById("myVideo")
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            myVideo.srcObject = localStream

            peer = new Peer(peerConfig1)
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
                    repVideo.srcObject = remoteStream
                })
            })

            // Handle incoming data connections
            peer.on("connection", (connection) => {
                conn = connection
                conn.on("data", (data) => {
                    console.log("Received:", data)
                    addMessage(data, false)
                })
                conn.on("open", () => {
                    console.log("Connection opened")
                    document.getElementById("recId").value = connection.peer
                    updateUIForConnectedState()
                })
            })
        } catch (error) {
            console.error("Error accessing media devices.", error)
        }
    }

    // Connect to the recipient peer
    const connect = async (e) => {
        e.preventDefault()
        const recId = document.getElementById("recId").value

        if (!peer) {
            console.error("Peer not initialized.")
            return
        }

        conn = peer.connect(recId)
        conn.on("open", () => {
            console.log("Connected to:", recId)
            updateUIForConnectedState()

            // Set up data connection handler
            conn.on("data", (data) => {
                console.log("Received:", data)
                addMessage(data, false)
            })

            // Make a call to the recipient
            call = peer.call(recId, localStream)
            call.on("stream", (remoteStream) => {
                const repVideo = document.getElementById("repVideo")
                repVideo.srcObject = remoteStream
            })
        })

        conn.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }

    // Update UI for connected state
    const updateUIForConnectedState = () => {
        document.getElementById("recId").readOnly = true
        //document.getElementById("connectButton").innerText = "Disconnect"
        //document.getElementById("connectButton").onclick = disconnect
        document.getElementById("messages").style.display = "block"
        //document.getElementById("statusBar").innerText = "connected"
    }

    // Disconnect the peer connection
    const disconnect = () => {
        if (call) call.close()
        if (conn) conn.close()
        if (peer) peer.destroy()

        document.getElementById("recId").readOnly = false
        //document.getElementById("connectButton").innerText = "Connect"
        //document.getElementById("connectButton").onclick = (e) => connect(e)
        document.getElementById("messages").style.display = "none"
        //document.getElementById("statusBar").innerText = "not connected"
        document.getElementById("myVideo").srcObject = null
        document.getElementById("repVideo").srcObject = null

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
                        <input type="text" class="border border-gray-400 p-2 rounded w-full" 
                        value={recId} onChange={e=>setRecId(e.target.value)} />
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

                <div class="flex flex-col w-full" style="display:none" id="messages">
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
            </div>
            <div class="text-center">{isConnected ? "Connected" : "Not connected"}</div>
        </div>
    )
}
