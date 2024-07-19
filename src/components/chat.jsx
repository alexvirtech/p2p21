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
            state.conn.send({type:'msg',payload:chatMessage})
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
        <div class="grow px-4 pb-4 pt-0">
            {(state.remoteStream || true) && (
                <div class="flex flex-col w-full grow h-full min-h-0">
                    <div class="flex flex-col flex-grow min-h-0 overflow-hidden">
                        <div
                            class="border border-gray-400 w-full flex-grow mb-4 rounded overflow-y-auto overflow-x-hidden px-4 py-2"
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
                                class="border-l border-t border-b border-gray-400 p-2 rounded-l grow"
                                ref={textInput}
                            />
                            <button
                                type="submit"
                                class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                                id="sendButton"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                                    <path
                                        fill="#ffffff"
                                        d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
