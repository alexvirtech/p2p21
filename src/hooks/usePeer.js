import { useEffect, useState, useRef } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"
import { useStream } from "./useStream"
import { invType } from "../utils/common"
import useQueryParams from "../hooks/useQueryParams"
import { EncryptText, DecryptText, EncryptStream, DecryptStream } from "../utils/encdec"

const RELOAD_TIME_LIMIT = 30000 // 30 seconds time limit to reload the saved peer connection

export const usePeer = (dispatch, state) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const [call, setCall] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const { localStream } = useStream("video")
    const peerInitializedRef = useRef(false) // Track if the peer has been initialized
    const connInitializedRef = useRef(false)
    const accRef = useRef()

    const { id, tp, pk } = useQueryParams()

    useEffect(() => {
        if (id && tp && pk) {
            dispatch({ type: "SET_RECIPIENT", payload: { recipient: { address: id, publicKey: pk }, tp } })
        }
    }, [id, tp, pk])

    useEffect(() => {
        if (state.recipient && state.recipient.address && peer) {
            connect(state.recipient.address)
        }
    }, [state.recipient, peer])

    useEffect(() => {
        if (peerInitializedRef.current) return

        if (state.account) {
            console.log(`Initializing peer for account: ${state.account.name}`)
            initPeer()
            peerInitializedRef.current = true
        }
    }, [state.account?.name])

    useEffect(() => {
        if (localStream) {
            dispatch({ type: "SET_PEER", payload: { localStream } })
        }
    }, [localStream])

    const initPeer = async () => {
        if (peerInitializedRef.current) {
            console.warn("Peer is already initialized")
            return
        }

        try {
            const pr = new Peer(null, { ...peerConfig, debug: 2 })

            pr.on("open", (id) => {
                setPeer(pr)
                dispatch({ type: "SET_PEER", payload: { peer: pr } })
                dispatch({ type: "SET_ADDRESS", payload: id })
                console.log("Peer ID:", id)
            })

            pr.on("call", async (incomingCall) => {
                console.log("Incoming call")
                dispatch({ type: "SET_PEER", payload: { call: incomingCall } })
                let streamToSend = localStream

                if (state.mode === invType.Secure && localStream) {
                    const { encryptedStream } = await EncryptStream(
                        localStream,
                        state.account.wallet.privateKey,
                        incomingCall.metadata.pk,
                    )
                    streamToSend = encryptedStream
                }

                incomingCall.answer(streamToSend)
                incomingCall.on("stream", async (remoteStream) => {
                    let streamToSet = remoteStream
                    if (state.mode === invType.Secure) {
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
                    connection.send({ type: "pk", payload: state.account.wallet.publicKey })
                })

                connection.on("data", async (data) => {
                    console.log("Received data:", data)
                    if (state.mode === invType.Secure && typeof data === "object" && data.encryptedText) {
                        const decryptedData = await DecryptText(
                            data.encryptedText,
                            data.encryptedAesKey,
                            data.iv,
                            state.account.wallet.privateKey,
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
                console.log("Peer error:", err)
                if (err.type === "unavailable-id") {
                    console.log("ID is taken. Reconnecting...")
                    pr.destroy()
                }
            })
        } catch (error) {
            console.error("Error creating peer:", error)
        }
    }

    useEffect(() => {
        if (!conn || connInitializedRef.current) return // Check if connection is already initialized

        conn.on("open", async () => {
            connInitializedRef.current = true // Mark connection as initialized
            console.log("Connection opened with peer:", conn.peer)
            dispatch({ type: "SET_PEER", payload: { conn } })
            //conn.send({ type: "pk", payload: state.account.wallet.publicKey })

            let callToSet
            if (state.mode === invType.Secure) {
                const { encryptedStream, encryptedAesKey, iv } = await EncryptStream(
                    localStream,
                    state.account.wallet.privateKey,
                    state.recipient.publicKey,
                )
                callToSet = peer.call(conn.peer, encryptedStream, { metadata: { encryptedAesKey, iv, pk: state.account.wallet.publicKey } })
            } else {
                callToSet = peer.call(conn.peer, localStream)
            }

            setCall(callToSet)
            dispatch({ type: "SET_PEER", payload: { call: callToSet } })

            dispatch({ type: "SET_MODAL", payload: null })
            dispatch({ type: "CONNECT", payload: true })

            callToSet.peerConnection.ontrack = async (event) => {
                let streamToSet = event.streams[0]
                if (state.mode === invType.Secure) {
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
            if (state.mode === invType.Secure && typeof data === "object" && data.encryptedText) {
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
            cleanupAfterDisconnect()
            connInitializedRef.current = false // Reset connection initialization flag on close
            localStorage.removeItem("savedRecipient") // Clean up on connection close
            localStorage.removeItem("savedTimestamp")
        })

        conn.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }, [conn])

    useEffect(() => {
        if (!call) return
        call.on("stream", async (remoteStream) => {
            let streamToSet = remoteStream
            if (state.mode === invType.Secure) {
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
        const connection = peer.connect(recId,{pk:state.account.wallet.publicKey})
        setConn(connection)

        connection.on("open", () => {
            console.log("Connection successfully opened to peer:", recId)
            dispatch({ type: "CONNECT", payload: true })
        })

        connection.on("error", (err) => {
            console.error("Error during connection:", err)
        })
    }

    const handleDisconnect = () => {
        console.log("Handling disconnect...")

        if (conn) {
            conn.send({ type: "disconnect" })
            setTimeout(() => {
                console.log("Closing connection...")
                conn.close()
                cleanupAfterDisconnect()
                connInitializedRef.current = false // Reset connection initialization flag
            }, 100)
        } else {
            cleanupAfterDisconnect()
        }

        if (call) {
            console.log("Closing call...")
            call.close()
        }
    }

    const cleanupAfterDisconnect = () => {
        setRemoteStream(null)
        dispatch({ type: "SET_PEER", payload: { remoteStream: null, call: null, conn: null } })
        dispatch({ type: "SET_MODE", payload: null })
        dispatch({ type: "SET_MODAL", payload: null })
        dispatch({ type: "CONNECT", payload: false })
        //localStorage.removeItem("savedRecipient") // Clean up on disconnect
        //localStorage.removeItem("savedTimestamp")
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
            cleanupAfterDisconnect()
        } else if (data.type === "stopScreen") {
            stopSharedScreen()
        } else if (data.type === "set_tab") {
            dispatch({ type: "SET_TAB", payload: { tab: data.payload, isReceiver: true } })
        } else if (data.type === "msg") {
            dispatch({ type: "ADD_MESSAGE", payload: { message: data.payload, isMine: false } })
        } else if (data.type === "pk") {
            dispatch({ type: "SET_RECIPIENT_PK", payload: data.payload })
        }
    }

    useEffect(() => {
        if (state.disconnectExt) {
            handleDisconnect()
            dispatch({ type: "DISCONNECT_EXT", payload: true })
            setTimeout(() => {
                dispatch({ type: "DISCONNECT_EXT", payload: false })
            }, 1000)
        }
    }, [state.disconnectExt])

    return { peer, connect, disconnect: handleDisconnect, handleDisconnect }
}
