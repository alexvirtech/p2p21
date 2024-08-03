import { useEffect, useState } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"
import { useStream } from "./useStream"
import { invType } from "../utils/common"

export const usePeer = (dispatch, state) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const { localStream } = useStream("video")

    const accounts = ["Default", "Default 1", "Default 2", "Default 3", "Default 4"]

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

            // Add the custom disconnectRecipient function
           /*  pr.disconnectRecipient = () => {
                if (conn) {
                    if (conn.open) {
                        console.log("Sending disconnect message to recipient...")
                        conn.send({ type: "disconnect" })  // Notify the recipient to disconnect
                    } else {
                        console.log("Connection is not open, retrying...")
                        conn.on("open", () => {
                            console.log("Connection opened, now sending disconnect message to recipient...")
                            conn.send({ type: "disconnect" })  // Notify the recipient to disconnect
                        })
                    }
                } else {
                    console.log("Connection is not available to send disconnect message")
                }
                handleDisconnect()
            } */

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
                console.log("Connection established with peer:", connection.peer)

                // Check if the connection is immediately open
                if (connection.open) {
                    console.log("Connection is already open with peer:", connection.peer)
                } else {
                    console.log("Waiting for connection to open with peer:", connection.peer)
                }

                connection.on("open", () => {
                    console.log("Connection is now open with peer:", connection.peer)
                })

                connection.on("data", (data) => {
                    console.log("Received data:", data)
                    handleData(data)
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
            console.log("Connection opened with peer:", conn.peer)
            dispatch({ type: "SET_PEER", payload: { conn } })
            const cn = peer.call(conn.peer, localStream)
            setCall(cn)
            dispatch({ type: "SET_PEER", payload: { call: cn } })

            dispatch({ type: "SET_MODE", payload: invType.Basic })

            cn.peerConnection.ontrack = (event) => {
                const [stream] = event.streams
                setRemoteStream(stream)
                dispatch({ type: "SET_PEER", payload: { remoteStream: stream } })
            }
        })

        conn.on("data", (data) => {
            console.log("Received data on connection:", data)
            handleData(data)
        })

        conn.on("close", () => {
            console.log("Connection closed")
            handleDisconnect()
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
            console.log("Call closed")
            handleDisconnect()
        })
        call.on("error", (err) => {
            console.error("Call error:", err)
        })
    }, [call])

    const connect = (recId) => {
        console.log("Attempting to connect to peer:", recId)
        const connection = peer.connect(recId)
        setConn(connection)

        connection.on("open", () => {
            console.log("Connection successfully opened to peer:", recId)
        })

        connection.on("error", (err) => {
            console.error("Error during connection:", err)
        })
    }

    const handleDisconnect = () => {
        console.log("Handling disconnect...")
        if (call) {
            console.log("Closing call...")
            call.close()
        }
        if (conn) {
            console.log("Closing connection...")
            conn.close()
        }
        setRemoteStream(null)
        dispatch({ type: "SET_PEER", payload: { remoteStream: null, call: null, conn: null } })
        dispatch({ type: "SET_MODE", payload: null })
        dispatch({ type: "SET_MODAL", payload: null })
    }

    const stopSharedScreen = () => {
        if (state.tempStream) {
            state.tempStream.getTracks().forEach((track) => track.stop())
        }
        dispatch({ type: "SET_TEMP_STREAM", payload: null })
    }

    const handleData = (data) => {
        console.log("Handling data:", data)
        if (data.type === "disconnect") {
            console.log("Disconnect message received")
            handleDisconnect()  // Handle the disconnect notification
        } else if (data.type === "stopScreen") {
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

    return { peer, connect, disconnect: handleDisconnect, handleDisconnect }
}
