import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"
import Video from "../components/video"
import { invType } from "../utils/common"
import Invitation from "../modals/invitation"
import useQueryParams from "../hooks/useQueryParams"

const Basic = () => {
    const { state, dispatch } = useContext(Context)
    const { peer, message, connect, disconnect } = usePeer(dispatch, state)
    const [type, setType] = useState(invType.Basic)
    //const {id,tp} = useQueryParams()

    /* useEffect(() => {
        if(id && tp){
            dispatch({type:'SET_RECIPIENT',payload:id})
            dispatch({ type: "SET_PAGE", payload: tp.toLowerCase() })            
        }
    }, [])

    const invite = (type) => {
        setType(type)
        dispatch({ type: "SET_MODAL", payload: "invitation" })
    }
 */
    const closeModal = () => {
        dispatch({ type: "SET_MODAL", payload: null })
    }

    return (
        <div class="h-full  w-full">
            <div class="flex justify-between gap-8 w-full h-full px-8 py-4">
                <div class="h-full w-1/2 flex justify-center items-center">
                    {state.remoteStream ? <Video stream={state.remoteStream} name={"User 2"} /> : <div>not connected</div>}
                    {/* <Video stream={state.localStream} name="my video" /> */}
                </div>
                <div class="h-full w-1/2 border border-gray-400 rounded-md flex justify-center items-center ">
                    <div class="w-full max-w-[600px]">temp</div>
                </div>
            </div>
            {state.modal === "invitation" && <Invitation type={type} close={closeModal} />}
        </div>
    )
}

export default Basic
