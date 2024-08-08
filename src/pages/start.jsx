import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"
import Video from "../components/video"
import InviteButtons from "../components/inviteButtons"
import LayoutDash from "../layouts/layoutDash"

const Start = () => {
    const { state, dispatch } = useContext(Context)
    const { peer, message, connect, disconnect, handleDisconnect } = usePeer(dispatch, state)

    // temp block for layout testing
    const Block = ({ title }) => {
        return <div class="h-full w-full border border-gray-400 rounded text-sm text-center">{title}</div>
    }

    {
        /* <div class="h-full w-full">
                <div class="landscape:flex landscape:justify-between gap-8 w-full h-full px-4 low:px-8 low:py-4 portrait:flex portrait:flex-col">
                    <div class="landscape:h-full landscape:w-1/2 portrait:max-h-1/2 portrait:grow portrait:w-full">
                        <div class={`w-full h-full flex justify-center items-center gap-2 portrait:flex portrait:flex-col`}> 
                            <Video stream={state.localStream} name="my video" />
                            {state.remoteStream && <Video stream={state.remoteStream} name="remote video" />}
                        </div>                    
                    </div>
                    <div class="landscape:w-1/2 portrait:w-full portrait:h-fit">
                        {state.isConnected ? <div class="p-4">{state.mode}</div> : <InviteButtons />}
                    </div>
                </div>
            </div> */
    }

    return (
        <LayoutDash
            video={[<Video stream={state.localStream}/>,<Video stream={state.remoteStream} />]}
            monitor={<Block title="temp for monitor" />}
            chat={<Block title="temp for chat" />}
            invite={<Block title="temp for invitation buttons" />}
        />
    )
}

export default Start
