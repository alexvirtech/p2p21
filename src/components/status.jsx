import { useContext, useEffect, useState } from "preact/hooks"
import { Context } from "../utils/context"
import { DisconnectIcon, ConnectIcon, ChatIcon, ChatCloseIcon, VideoIcon, VideoCloseIcon, MonitorIcon, MonitorCloseIcon, JoinIcon } from "../utils/icons"
import ConnectMenu from "./connectMenu"
import { usePeer } from "../hooks/usePeer"
import Invitation from "../modals/invitation"
import Join from "../modals/join"
import { invType } from "../utils/common"

export default function Status() {
    const { state, dispatch } = useContext(Context)
    const [showConnectMenu, setShowConnectMenu] = useState(false)

    useEffect(() => {
        if (state.peer) {
            //console.log(state.peer)
        }
    }, [state.peer])

    const closeModal = () => {
        dispatch({ type: "SET_MODAL", payload: null })
    }

    const handleDisconnect = () => {
        dispatch({ type: "DISCONNECT_EXT", payload: true })
        setTimeout(() => {
            dispatch({ type: "DISCONNECT_EXT", payload: false })
        }, 1000)
    }

    return (
        <div class="p-3 border-t border-gray-400 text-sm h-[62px] flex items-center justify-center gap-2">
            {state.isConnected ? (
                <>
                    {state.isMonitor ? (
                        <div
                            class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white p-2 aspect-w-1 aspect-h-1"
                            onClick={() => dispatch({ type: "SHOW_MONITOR", payload: false })}
                            title="temp button"
                        >
                            <MonitorCloseIcon />
                        </div>
                    ) : (
                        <div
                            class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white p-2 aspect-w-1 aspect-h-1"
                            onClick={() => dispatch({ type: "SHOW_MONITOR", payload: true })}
                            title="temp button"
                        >
                            <MonitorIcon />
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
                        onClick={handleDisconnect}
                    >
                        <DisconnectIcon />
                    </div>
                </>
            ) : (
                <div class="relative flex justify-center gap-2">
                    <div
                        class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 z-10 flex justify-center items-center gap-2"
                        onClick={() =>dispatch({ type: "SET_MODAL", payload: "invitation", mode:invType.Secure })}
                        title="start secure call"
                    >
                        <ConnectIcon />
                        <div class="text-lg">Invite</div>
                    </div>
                    <div
                        class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 z-10 flex justify-center items-center gap-2"
                        onClick={() =>dispatch({ type: "SET_MODAL", payload: "join" })}
                        title="start secure call"
                    >
                        <JoinIcon />
                        <div class="text-lg">Join</div>
                    </div>
                    {state.modal === "invitation" && <Invitation close={()=>closeModal()} />}
                    {state.modal === "join" && <Join close={()=>closeModal()} />}
                </div>
            )}
        </div>
    )
}
