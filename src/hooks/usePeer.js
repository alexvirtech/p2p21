import { useEffect, useState } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"
import { useStream } from "./useStream"

export const usePeer = (myId,close) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [message, setMessage] = useState("")
    const [remoteStream, setRemoteStream] = useState(null)
    const { localStream } = useStream()

    useEffect(() => {
        init()
    }, [])

    // initialize new peer
    const init = async () => {
        try {
            const pr = myId ? new Peer(myId, peerConfig) : new Peer(peerConfig)
            setPeer(pr)
        } catch (error) {
            console.error("Error creating peer:", error)
        }
    }

    // on peer create
    useEffect(() => {
        if (!peer) return
        // handle peer open event for my side
        peer.on("open", (id) => {
            console.log("Peer ID:", id)
        })

        // Handle incoming calls
        peer.on("call", (incomingCall) => {
            console.log("Receiving call...")
            incomingCall.answer(localStream)
            incomingCall.on("stream", (remStream) => {
                setRemoteStream(remStream)
            })
        })

        // Handle incoming data connections
        peer.on("connection", (connection) => {
            setConn(connection)
        })

        peer.on("error", (err) => {
            console.error("Peer error:", err)
        })
    }, [peer])

    // on connection create
    useEffect(() => {
        if (!conn) return
        conn.on("open", () => {
            console.log("Connected to:", conn.peer)

            // Handle data received from another side
            conn.on("data", (data) => {
                console.log("Received:", data)
                setMessage(data)
            })

            // Handle data connection close event
            conn.on("close", () => {
                console.log("Data connection closed by the remote peer")
                disconnect()
            })

            // Make a call to the recipient, sending him my local stream
            setCall(peer.call(conn.peer, localStream))
        })

        conn.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }, [conn])

    useEffect(() => {
        if (!call) return
        //handle stream received from another side
        call.on("stream", (remStream) => {
            setRemoteStream(remStream)
        })

        call.on("close", () => {
            console.log("Call closed by the remote peer")
            disconnect()
        })

        call.on("error", (err) => {
            console.error("Call error:", err)
        })
    }, [call])

    const connect = (recId) => {
        const connection = peer.connect(recId)
        setConn(connection)
    }

    const disconnect = () => {
        if (call) call.close()
        if (conn) conn.close()
        setRemoteStream(null)
        close()
    }

    return { localStream, remoteStream, peer, conn, call, message, connect, disconnect }
}
