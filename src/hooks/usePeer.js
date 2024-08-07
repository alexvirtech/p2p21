import { useEffect, useState } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"
import { useStream } from "./useStream"
import { invType } from "../utils/common"
import useQueryParams from "../hooks/useQueryParams" // Import useQueryParams
import { EncryptText, DecryptText, EncryptStream, DecryptStream } from "../utils/encdec" // Import encryption utilities

export const usePeer = (dispatch, state) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const { localStream } = useStream("video")

    const accounts = ["Default", "Default 1", "Default 2", "Default 3", "Default 4"]

    // Query Params
    const { id, tp } = useQueryParams()

    useEffect(() => {
        if (id && tp) {
            dispatch({ type: "SET_RECIPIENT", payload: { id, tp } })
        }
    }, [id, tp])

    useEffect(() => {
        if (state.recipient && peer) {
            connect(state.recipient)
        }
    }, [state.recipient, peer])

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

            pr.on("call", async (incomingCall) => {
                console.log("Incoming call")
                dispatch({ type: "SET_PEER", payload: { call: incomingCall } })
                let streamToSend = localStream

                if (state.encryptedMode) {
                    const { encryptedStream } = await EncryptStream(localStream,state.account.wallet.privateKey, state.recipient)
                    streamToSend = encryptedStream
                }

                incomingCall.answer(streamToSend)
                incomingCall.on("stream", async (remoteStream) => {
                    let streamToSet = remoteStream
                    if (state.encryptedMode) {
                        streamToSet = await DecryptStream(
                            remoteStream,
                            incomingCall.metadata.encryptedAesKey,
                            incomingCall.metadata.iv,
                            state.account.wallet.privateKey,
                        )
                    }
                    setRemoteStream(streamToSet)
                    dispatch({ type: "SET_PEER", payload: { remoteStream: streamToSet } })
                })
            })

            pr.on("connection", (connection) => {
                setConn(connection)
                console.log("Connection established with peer:", connection.peer)

                connection.on("open", () => {
                    console.log("Connection is now open with peer:", connection.peer)
                })

                connection.on("data", async (data) => {
                    console.log("Received data:", data)
                    if (state.encryptedMode && typeof data === "object" && data.encryptedText) {
                        const decryptedData = await DecryptText(
                            data.encryptedText,
                            data.encryptedAesKey,
                            data.iv,
                            state.account.privateKey,
                        )
                        handleData(JSON.parse(decryptedData))
                    } else {
                        handleData(data)
                    }
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
        conn.on("open", async () => {
            console.log("Connection opened with peer:", conn.peer)
            dispatch({ type: "SET_PEER", payload: { conn } })

            let callToSet
            if (state.encryptedMode) {
                const { encryptedStream, encryptedAesKey, iv } = await EncryptStream(localStream,state.account.wallet.privateKey, conn.peer)
                callToSet = peer.call(conn.peer, encryptedStream, { metadata: { encryptedAesKey, iv } })
            } else {
                callToSet = peer.call(conn.peer, localStream)
            }

            setCall(callToSet)
            dispatch({ type: "SET_PEER", payload: { call: callToSet } })

            dispatch({ type: "SET_MODE", payload: invType.Basic })

            callToSet.peerConnection.ontrack = async (event) => {
                let streamToSet = event.streams[0]
                if (state.encryptedMode) {
                    streamToSet = await DecryptStream(
                        streamToSet,
                        callToSet.metadata.encryptedAesKey,
                        callToSet.metadata.iv,
                        state.account.wallet.privateKey,
                    )
                }
                setRemoteStream(streamToSet)
                dispatch({ type: "SET_PEER", payload: { remoteStream: streamToSet } })
            }
        })

        conn.on("data", async (data) => {
            console.log("Received data on connection:", data)
            if (state.encryptedMode && typeof data === "object" && data.encryptedText) {
                const decryptedData = await DecryptText(
                    data.encryptedText,
                    data.encryptedAesKey,
                    data.iv,
                    state.account.privateKey,
                )
                handleData(JSON.parse(decryptedData))
            } else {
                handleData(data)
            }
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
        call.on("stream", async (remoteStream) => {
            let streamToSet = remoteStream
            if (state.encryptedMode) {
                streamToSet = await DecryptStream(
                    remoteStream,
                    call.metadata.encryptedAesKey,
                    call.metadata.iv,
                    state.account.wallet.privateKey,
                )
            }
            setRemoteStream(streamToSet)
            dispatch({ type: "SET_PEER", payload: { remoteStream: streamToSet } })
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
            handleDisconnect() // Handle the disconnect notification
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

    return { peer, connect, disconnect: handleDisconnect, handleDisconnect } // Expose encryptedMode and setEncryptedMode
}
