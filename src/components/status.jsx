import { useContext, useEffect, useState } from "preact/hooks"
import { Context } from "../utils/context"
import { DisconnectIcon, ConnectIcon, ChatIcon, ChatCloseIcon, VideoIcon, VideoCloseIcon } from "../utils/icons"
import ConnectMenu from "./connectMenu"

export default function Status({ isConnected }) {
    const { state, dispatch } = useContext(Context)
    const [showConnectMenu, setShowConnectMenu] = useState(false)

    useEffect(() => {
        if (state.peer) {
            console.log(state.peer)
        }
    }, [state.peer])

    return (
        <div class="p-3 border-t border-gray-400 text-sm h-[62px] flex items-center justify-center gap-2">
            {state.isConnected ? (
                <>
                    {state.isVideo ? (
                        <div
                            class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white p-2 aspect-w-1 aspect-h-1"
                            onClick={() => dispatch({ type: "SHOW_VIDEO", payload: false })}
                            title="temp button"
                        >
                            <VideoCloseIcon />
                        </div>
                    ) : (
                        <div
                            class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white p-2 aspect-w-1 aspect-h-1"
                            onClick={() => dispatch({ type: "SHOW_VIDEO", payload: true })}
                            title="temp button"
                        >
                            <VideoIcon />
                        </div>
                    )}
                    {state.isChat ? (
                        <div
                            class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white p-2 aspect-w-1 aspect-h-1"
                            onClick={() => dispatch({ type: "SHOW_CHAT", payload: false })}
                            title="temp button"
                        >
                            <ChatCloseIcon />
                        </div>
                    ) : (
                        <div
                            class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white p-2 aspect-w-1 aspect-h-1"
                            onClick={() => dispatch({ type: "SHOW_CHAT", payload: true })}
                            title="temp button"
                        >
                            <ChatIcon />
                        </div>
                    )}
                    <div
                        class="cursor-pointer rounded bg-red-600 hover:bg-red-800 text-white p-2 aspect-w-1 aspect-h-1"
                        onClick={() => dispatch({ type: "CONNECT", payload: false })}
                    >
                        <DisconnectIcon />
                    </div>
                </>
            ) : (
                <div class="relative">
                    <div
                        class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white p-2 z-10"
                        onClick={() => setShowConnectMenu(!showConnectMenu)}
                        title="temp button"
                    >
                        <ConnectIcon />
                    </div>
                    {showConnectMenu && <ConnectMenu close={() => setShowConnectMenu(false)} />}
                </div>
            )}
        </div>
    )
}
