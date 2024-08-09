import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"
import Video from "../components/video"
import LayoutDash from "../layouts/layoutDash"

const Start = () => {
    const { state, dispatch } = useContext(Context)
    const { peer, message, connect, disconnect, handleDisconnect } = usePeer(dispatch, state)

    // temp block for layout testing
    const Block = ({ title }) => {
        return <div class="h-full w-full border border-gray-400 rounded text-sm text-center">{title}</div>
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
