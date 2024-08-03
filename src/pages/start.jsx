import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"
import Video from "../components/video"
import useQueryParams from "../hooks/useQueryParams"
import InviteButtons from "../components/inviteButtons"

const Start = () => {
    const { state, dispatch } = useContext(Context)
    const { peer, message, connect, disconnect, handleDisconnect } = usePeer(dispatch, state)
    const { id, tp } = useQueryParams()

    useEffect(() => {
        if (id && tp) {
            dispatch({ type: "SET_RECIPIENT", payload: id })
            dispatch({ type: "SET_MODE", payload: tp })
        }
    }, [])

    useEffect(() => {
        if (state.recipient && peer) {
            connect(state.recipient)
        }
    }, [state.recipient, peer])

    return (
        <div class="h-full w-full">
            <div class="flex justify-between gap-8 w-full h-full px-8 py-4">
                <div class="h-full w-1/2">
                    <div class={`${state.mode ? "h-1/2" : "h-full"} w-full flex justify-center items-center gap-2`}>
                        <Video stream={state.localStream} name="my video" />
                        {state.remoteStream && <Video stream={state.remoteStream} name="remote video" />}
                    </div>
                    {state.mode && <div class="py-4 text-center">
                        <button
                            class="py-1 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                            onClick={handleDisconnect}>
                            Disconnect
                        </button>
                    </div>}
                </div>
                <div class="h-full w-1/2 border border-gray-400 rounded-md">
                    {state.mode ? <div>{state.mode}</div> : <InviteButtons />}
                </div>
            </div>
        </div>
    )
}

export default Start
