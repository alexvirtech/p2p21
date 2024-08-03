import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"
import Video from "../components/video"
//import { invType } from "../utils/common"

import useQueryParams from "../hooks/useQueryParams"
import InviteButtons from "../components/inviteButtons"

const Start = () => {
    const { state, dispatch } = useContext(Context)   
    const { peer, message, connect, disconnect } = usePeer(dispatch, state)    
    const {id,tp} = useQueryParams()

    useEffect(() => {
        if(id && tp){
            dispatch({type:'SET_RECIPIENT',payload:id})
            dispatch({ type: "SET_MODE", payload: tp })            
        }
    }, [])    

    useEffect(() => {
        if (state.recipient && peer) {
            connect(state.recipient)
        }
    }, [state.recipient, peer])

    return (
        <div class="h-full  w-full">
            <div class="flex justify-between gap-8 w-full h-full px-8 py-4">
                <div class="h-full w-1/2 flex justify-center items-center">
                    <Video stream={state.localStream} name="my video" />
                    {state.remoteStream && <Video stream={state.remoteStream} name="my video" />}
                </div>
                <div class="h-full w-1/2 border border-gray-400 rounded-md">
                    {state.mode ? <div>{state.mode}</div> : <InviteButtons />}
                </div>
            </div>           
        </div>
    )
}

export default Start
