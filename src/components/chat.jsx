import { useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"

export default function Chat() {
    const { state, dispatch } = useContext(Context)
    const allMessages = useRef(null)
    const textInput = useRef(null)

    const send = (e) => {
        e.preventDefault()
        const chatMessage = textInput.current.value
        if (state.conn && state.conn.open) {
            state.conn.send(chatMessage)
            dispatch({ type: "ADD_MESSAGE", payload: { message: chatMessage, isMine: true } })
            textInput.current.value = ""
        } else {
            console.log("Connection is not open.")
        }
    }

    useEffect(() => {
        if (state.messages.length === 0) return
        allMessages.current.scrollTop = allMessages.current.scrollHeight
    }, [state.messages])

    return (
        state.remoteStream && (
            <div class="flex flex-col w-full">
                <form onsubmit={send}>
                    <div
                        class="grow border border-gray-400 w-full h-60 mb-4 rounded overflow-y-auto overflow-x-hidden px-4 py-2"
                        ref={allMessages}
                    >
                        {state.messages.map((msg) => (
                            <div class={msg.isMine ? "text-left pr-12" : "text-right pl-12"}>{msg.message}</div>
                        ))}
                    </div>
                    <div class="flex justify-between gap-2">
                        <input type="text" class="border border-gray-400 p-2 rounded grow" ref={textInput} />
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
        )
    )
}
