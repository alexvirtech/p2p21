import { useEffect, useState } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"
import { useStream } from "./useStream"
import { invType } from "../utils/common"

export const usePeer = (dispatch, state) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [message, setMessage] = useState("")
    const [remoteStream, setRemoteStream] = useState(null)
    const { localStream } = useStream("video")

    const accounts = ["Default", "Default 1", "Default 2", "Default 3", "Default 4"]  // List of predefined accounts

    useEffect(() => {
        if (peer) {
            console.log(`Destroying peer for account: ${peer.id}`)
            peer.destroy()
            setPeer(null)
        }

        if (state.account) {
            console.log(`Initializing peer for account: ${state.account.name}`)
            initPeer(state.account.wallet.publicKey)
        }
    }, [state.account])

    useEffect(() => {
        if (localStream) {
            dispatch({ type: "SET_PEER", payload: { localStream } })
        }
    }, [localStream])

    const initPeer = async (id) => {
        try {
            const pr = new Peer(id, peerConfig)

            pr.on("open", (id) => {
                setPeer(pr)
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
            })

            pr.on("connection", (connection) => {
                setConn(connection)
                connection.on("data", (data) => {
                    // handleData(data)
                })
            })

            pr.on("disconnected", () => {
                console.log("Peer disconnected. Not attempting to reconnect because peer is destroyed.")
            })

            pr.on("error", (err) => {
                if (err.type === "unavailable-id") {
                    console.log("ID is taken. Switching to the next account...")
                    switchToNextAccount()
                } else {
                    console.log("Peer error:", err)
                }
            })

        } catch (error) {
            console.error("Error creating peer:", error)
        }
    }

    const switchToNextAccount = () => {
        const currentIndex = accounts.indexOf(state.account.name)
        if (currentIndex !== -1 && currentIndex < accounts.length - 1) {
            const nextAccountName = accounts[currentIndex + 1]
            console.log(`Switching to account: ${nextAccountName}`)
            dispatch({ type: "SET_ACCOUNT_BY_NAME", payload: nextAccountName })
        } else {
            console.log("No more accounts available to switch to.")
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
            dispatch({type:'SET_MODAL',payload: null}) 
            dispatch({type:'SET_MODE',payload: invType.Basic}) // temp

            cn.peerConnection.ontrack = (event) => {
                const [stream] = event.streams
                setRemoteStream(stream)
                dispatch({ type: "SET_PEER", payload: { remoteStream: stream } })
            }
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
    }, [call])

    const connect = (recId) => {
        const connection = peer.connect(recId)
        setConn(connection)
    }

    const disconnect = () => {
        if (call) call.close()
        if (conn) conn.close()
        if (peer) {
            peer.destroy()
            setPeer(null)
        }
        setRemoteStream(null)
        dispatch({ type: "SET_PEER", payload: { remoteStream: null, peer: null, conn: null, call: null } })
        dispatch({ type: "SET_MODE", payload: null })
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

    return { peer, message, connect, disconnect }
}
