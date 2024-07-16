import { useEffect, useState } from 'preact/hooks'
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"

export const usePeer = ({myId,localStream,getMessage,disconnect}) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)    

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        try {
            //const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            const peer = new Peer(myId, peerConfig)
            setPeer(peer)
            //setLocalStream(stream)
        } catch (error) {
            console.error("Error accessing media devices.", error)
        }
    }

    useEffect(() => {
        if (peer) {
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
                connection.on("open", () => {
                    console.log("Connection opened with " + connection.peer)
                    //recId(connection.peer)
                })
                setConn(connection)
            })

            peer.on("error", (err) => {
                console.error("Peer error:", err)
            })
        }
    }, [peer])

    useEffect(() => {
        if (!conn) return
        conn.on("open", () => {
            console.log("Connected to:", conn.peer)

            // Set up data connection handler
            conn.on("data", (data) => {
                console.log("Received:", data)
                getMessage({ message: data, isMine: false })                
            })

            // Handle data connection close event
            conn.on("close", () => {
                console.log("Data connection closed by the remote peer")
                disconnect()
            })

            // Make a call to the recipient           
            setCall(peer.call(conn.peer, localStream))
            
        })

        conn.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }, [conn])

    useEffect(() => {
        if (!call) return
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
        connection.on("open", () => {
            console.log("Connection opened")
        })
        setConn(connection)
    }

    const disconnect = () => {
        if (call) call.close()
        if (conn) conn.close()        
    }


    return { remoteStream, peer, conn, call, connect, disconnect }
}