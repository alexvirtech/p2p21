import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"

export default function Caller() {
    const { state, dispatch } = useContext(Context)
    const [recId, setRecId] = useState("")
    const { peer, message, connect, disconnect } = usePeer(null)

    useEffect(() => {
        return () => {
            disconnect()
            setRecId("")
        }
    }, [])

    useEffect(() => {
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
                <div class="flex justify-between gap-0">
                    <input
                        type="text"
                        class="border-l border-t border-b border-gray-400 p-2 rounded-l w-full grow"
                        readOnly={state.conn ?? false}
                        value={recId}
                        onClick={async (e) => {
                            e.target.value = await navigator.clipboard.readText()
                            setRecId(e.target.value)
                        }}
                        onChange={(e) => setRecId(e.target.value)}
                    />
                    <button
                        type="submit"
                        class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold w-16 flex justify-center py-[9px] px-4 rounded-r"
                        onClick={handleConnect}
                    >
                        {/* {state.conn ? "Disconnect" : "Connect"} */}
                        {state.conn ? <svg xmlns="http://www.w3.org/2000/svg" height="20" width="25" viewBox="0 0 640 512"><path fill="#ffffff" d="M268.2 381.4l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48c-10.7 4.6-16.5 16.1-13.9 27.5l24 104c2.5 10.8 12.1 18.6 23.4 18.6 100.7 0 193.7-32.4 269.7-86.9l-80-61.8c-10.9 6.5-22.1 12.7-33.6 18.1zm365.6 76.7L475.1 335.5C537.9 256.4 576 156.9 576 48c0-11.2-7.7-20.9-18.6-23.4l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-12.2 26.1-27.9 50.3-46 72.8L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path fill="#ffffff" d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1 .6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"/></svg>}
                    </button>
                </div>
            </div>          
        </form>
    ) : (
        <div>Loading ...</div>
    )
}
