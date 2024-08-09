import { useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import { SendMessageIcon } from "../utils/icons"

export default function Chat() {
    const { state, dispatch } = useContext(Context)
    const allMessages = useRef(null)
    const textInput = useRef(null)

    useEffect(() => {
        textInput.current.focus()
    }, [])

    const send = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const chatMessage = textInput.current.value
        if (state.conn && state.conn.open) {
            if (!state.lastSentMessage || state.lastSentMessage !== chatMessage) {
                state.conn.send({ type: "msg", payload: chatMessage })
                dispatch({ type: "ADD_MESSAGE", payload: { message: chatMessage, isMine: true } })
                textInput.current.value = ""
                textInput.current.focus()
                dispatch({ type: "SET_LAST_SENT_MESSAGE", payload: chatMessage }) // Use a reducer to update the last message sent
            }
        } else {
            console.log("Connection is not open.")
        }
    }

    useEffect(() => {
        if (state.messages.length === 0) return
        allMessages.current.scrollTop = allMessages.current.scrollHeight
    }, [state.messages])

    return (
        <div class="h-full">
            <div class="flex flex-col w-full grow h-full min-h-0">
                <div class="flex flex-col flex-grow min-h-0 overflow-hidden">
                    <div
                        class="border border-gray-400 w-full flex-grow mb-4 rounded-md overflow-y-auto overflow-x-hidden px-4 py-2"
                        ref={allMessages}
                    >
                        {state.messages.map((msg) => (
                            <div class={msg.isMine ? "text-left pr-12" : "text-right pl-12"}>{msg.message}</div>
                        ))}
                    </div>
                </div>
                <form onsubmit={send} class="flex-none">
                    <div class="flex justify-between gap-0">
                        <input
                            type="text"
                            class="border-l border-t border-b border-gray-400 p-1.5 rounded-l-md grow"
                            ref={textInput}
                        />
                        <button
                            type="submit"
                            class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 pl-2.5 pr-3 rounded-r-md"
                            id="sendButton"
                        >
                            <SendMessageIcon />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
