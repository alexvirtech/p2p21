import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"

export default function Caller() {
    const { state, dispatch } = useContext(Context)
    const [recId, setRecId] = useState("")

    const { localStream, remoteStream, peer, conn, call, message, connect, disconnect } = usePeer(null)

    /*  const close = () => {
        dispatch({ type: "SET_PEER", payload: { remoteStream:null, peer:null, conn:null, call:null } })            
        setRecId("")
    } */

    useEffect(() => {
        return () => {
            disconnect()
            setRecId("")
        }
    }, [])

    useEffect(() => {
        //if(!state.conn) return
        if (state.conn) {
            setRecId(state.conn.peer)
        } else {
            setRecId("")
        }
    }, [state.conn])

    useEffect(() => {
        if (message === "") return
        dispatch({ type: "ADD_MESSAGE", payload: { message, isMine: false } })
    }, [message])

    const getId = (e) => {
        e.target.select()
        navigator.clipboard.writeText(e.target.value)
    }

    const handleConnect = (e) => {
        e.preventDefault()
        if (state.conn) {
            disconnect()
            setRecId("")
        } else {
            connect(recId)
        }
    }

    return peer ? (
        <form onSubmit={connect}>
            <div class="w-full">
                <div>My Nickname</div>
                <input
                    type="text"
                    class="border border-gray-400 p-2 rounded w-full"
                    value={state.peer?.id}
                    onClick={getId}
                    readonly
                />
            </div>

            <div class="w-full">
                <div>Recipient</div>
                <input
                    type="text"
                    class="border border-gray-400 p-2 rounded w-full"
                    readOnly={state.conn ?? false}
                    value={recId}
                    onClick={async (e) => {
                        e.target.value = await navigator.clipboard.readText()
                        setRecId(e.target.value)
                    }}
                    onChange={(e) => setRecId(e.target.value)}
                />
            </div>
            <div class="py-2">
                <button
                    type="submit"
                    class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-[9px] px-4 rounded"
                    onClick={handleConnect}
                >
                    {state.conn ? "Disconnect" : "Connect"}
                </button>
            </div>
        </form>
    ) : (
        <div>Loading ...</div>
    )
}
