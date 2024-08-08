import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"
import Video from "../components/video"
import InviteButtons from "../components/inviteButtons"

const Start = () => {
    const { state, dispatch } = useContext(Context)
    const { peer, message, connect, disconnect, handleDisconnect } = usePeer(dispatch, state)   

    return (
        <div class="h-full w-full">
            <div class="landscape:flex landscape:justify-between gap-8 w-full h-full px-4 low:px-8 low:py-4 portrait:flex portrait:flex-col">
                <div class="landscape:h-full landscape:w-1/2 portrait:max-h-1/2 portrait:grow portrait:w-full">
                    <div class={`w-full h-full flex justify-center items-center gap-2 portrait:flex portrait:flex-col`}> {/* ${state.mode ? "h-1/2" : "h-full"} */}
                        <Video stream={state.localStream} name="my video" />
                        {state.remoteStream && <Video stream={state.remoteStream} name="remote video" />}
                    </div>                    
                </div>
                <div class="landscape:w-1/2 portrait:w-full portrait:h-fit">
                    {state.isConnected ? <div class="p-4">{state.mode}</div> : <InviteButtons />}
                </div>
            </div>
        </div>
    )
}

export default Start
