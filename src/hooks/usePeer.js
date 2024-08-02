import { useEffect, useState } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"
import { useStream } from "./useStream"

export const usePeer = (dispatch, state) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [message, setMessage] = useState("")
    const [remoteStream, setRemoteStream] = useState(null)
    const { localStream } = useStream("video")

    useEffect(() => {
        if (!state.account) return
        initPeer()
    }, [state.account])

    useEffect(() => {
        if (localStream) {
            dispatch({ type: "SET_PEER", payload: { localStream } })
        }
    }, [localStream])

    const initPeer = async () => {
        if (peer && peer.open) {
            console.log("Peer already exists")
            return
        }

        try {
            const pr = new Peer(state.account.wallet.publicKey, peerConfig)
            setPeer(pr)

            pr.on("open", (id) => {
                dispatch({ type: "SET_PEER", payload: { peer: pr } })
                console.log("Peer ID:", id)
            })

            pr.on("call", (incomingCall) => {
                console.log("Incoming call")
                dispatch({ type: "SET_PEER", payload: { call: incomingCall } })
                incomingCall.answer(localStream)
                incomingCall.on("stream", (remoteStream) => {
                    setRemoteStream(remoteStream)
                    dispatch({ type: "SET_PEER", payload: { remoteStream } })
                })
                incomingCall.peerConnection.ontrack = (event) => {
                    console.log("Track event received on incoming call")
                    const [stream] = event.streams
                    setRemoteStream(stream)
                    dispatch({ type: "SET_PEER", payload: { remoteStream: stream } })
                }
            })

            pr.on("connection", (connection) => {
                setConn(connection)
                connection.on("data", (data) => {
                    //handleData(data)
                })
            })

            pr.on("disconnected", () => {
                console.log("Peer disconnected. Attempting to reconnect...")
                pr.reconnect()
            })

            pr.on("error", (err) => {
                console.error("Peer error:", err)
                if (err.type === "unavailable-id") {
                    console.log("ID is taken. Attempting to reconnect...")
                    pr.reconnect()
                }
            })
        } catch (error) {
            console.error("Error creating peer:", error)
        }
    }

    useEffect(() => {
        if (!conn) return
        conn.on("open", () => {
            console.log("Connection opened")
            dispatch({ type: "SET_PEER", payload: { conn } })
            const cn = peer.call(conn.peer, localStream)
            setCall(cn)
            dispatch({ type: "SET_PEER", payload: { call: cn } })

            cn.peerConnection.ontrack = (event) => {
                console.log("Track event received on outgoing call")
                const [stream] = event.streams
                setRemoteStream(stream)
                dispatch({ type: "SET_PEER", payload: { remoteStream: stream } })
            }

            const existingTracks = cn.peerConnection.getSenders().map((sender) => sender.track?.kind)
            console.log("Existing tracks before adding: ", existingTracks)

            localStream.getTracks().forEach((track) => {
                if (!existingTracks.includes(track.kind)) {
                    console.log(`Adding track: ${track.kind}`)
                    try {
                        cn.peerConnection.addTrack(track, localStream)
                    } catch (error) {
                        console.error(`Failed to add track: ${track.kind}`, error)
                    }
                } else {
                    console.log(`Track already exists: ${track.kind}`)
                }
            })

            const updatedTracks = cn.peerConnection.getSenders().map((sender) => sender.track?.kind)
            console.log("Existing tracks after adding: ", updatedTracks)
        })

        conn.on("data", (data) => {
            handleData(data)
        })

        conn.on("close", () => {
            disconnect()
        })

        conn.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }, [conn])

    useEffect(() => {
        if (!call) return
        call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream)
            dispatch({ type: "SET_PEER", payload: { remoteStream } })
        })
        call.on("close", () => {
            disconnect()
        })
        call.on("error", (err) => {
            console.error("Call error:", err)
        })
        call.peerConnection.ontrack = (event) => {
            console.log("Track event received on call")
            const [stream] = event.streams
            setRemoteStream(stream)
            dispatch({ type: "SET_PEER", payload: { remoteStream: stream } })
        }

        if (localStream) {
            localStream.getTracks().forEach((track) => {
                const sender = call.peerConnection.getSenders().find((s) => s.track?.kind === track.kind)
                if (!sender) {
                    console.log(`Adding missing track: ${track.kind}`)
                    call.peerConnection.addTrack(track, localStream)
                } else {
                    console.log(`Track already added: ${track.kind}`)
                }
            })
        }
    }, [call, localStream])

    const connect = (recId) => {
        const connection = peer.connect(recId)
        setConn(connection)
    }

    const disconnect = () => {
        if (call) call.close()
        if (conn) conn.close()
        setRemoteStream(null)
        dispatch({ type: "SET_PEER", payload: { remoteStream: null, peer: null, conn: null, call: null } })
    }

    const stopSharedScreen = () => {
        if (state.tempStream) {
            state.tempStream.getTracks().forEach((track) => track.stop())
        }
        dispatch({ type: "SET_TEMP_STREAM", payload: null })
    }

    const handleData = (data) => {
        if (data.type === "stopScreen") {
            stopSharedScreen()
        } else if (data.type === "set_tab") {
            dispatch({ type: "SET_TAB", payload: { tab: data.payload, isReceiver: true } })
        } else if (data.type === "msg") {
            dispatch({ type: "ADD_MESSAGE", payload: { message: data.payload, isMine: false } })
        }
    }

    useEffect(() => {
        const handleUnload = () => {
            if (peer) {
                peer.destroy()
            }
        }

        window.addEventListener("beforeunload", handleUnload)

        return () => {
            window.removeEventListener("beforeunload", handleUnload)
            if (peer) {
                peer.destroy()
            }
        }
    }, [peer])

    // Handle account changes by disconnecting and reconnecting
    useEffect(() => {
        if (peer) {
            disconnect() // Disconnect the current peer
            if (state.account) {
                initPeer(state.account.wallet.publicKey) // Recreate the peer with the new account
            }
        }
    }, [state.account])

    return { peer, message, connect, disconnect }
}
