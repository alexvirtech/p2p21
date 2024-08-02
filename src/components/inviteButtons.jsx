import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { invType } from "../utils/common"
import Invitation from "../modals/invitation"

export default function InviteButtons() {
    const { state, dispatch } = useContext(Context)
    const [type, setType] = useState(invType.Basic)
    
    const invite = (type) => {
        setType(type)
        dispatch({ type: "SET_MODAL", payload: "invitation" })
    }

    const closeModal = () => {
        dispatch({type:'SET_MODAL',payload:null})
    }

    return (
        <div class="flex justify-center items-center h-full w-full">
            <div class="w-full max-w-[600px]">
                <div class="flex justify-center gap-4">
                    <div class="p-4 rounded-md w-1/2 pb-4 text-center border border-slate-400">
                        <button
                            class="bg-blue-600 hover:bg-blue-800 text-white w-full rounded py-1 text-lg mb-2 cursor-pointer"
                            onClick={() => invite(invType.Basic)}
                        >
                            Basic
                        </button>
                        <div class="text-sm">Peer-to-peer video and text chat for two participants.</div>
                    </div>
                    <div class="p-4 rounded-md w-1/2 pb-4 text-center border border-slate-400">
                        <button
                            class="bg-blue-600 hover:bg-blue-800 text-white w-full rounded py-1 text-lg mb-2 cursor-pointer"
                            onClick={() => invite(invType.Advanced)}
                        >
                            Advanced
                        </button>
                        <div class="text-sm">
                            Peer-to-peer video and text chat with collaboration tools: shared tasks, screens, whiteboard, files
                            and folders.
                        </div>
                    </div>
                </div>
                <div class="flex justify-center gap-4 mt-4">
                    <div class="p-4 rounded-md w-1/2 pb-4 text-center border border-slate-400">
                        <button
                            class="bg-blue-600 hover:bg-blue-800 text-white w-full rounded py-1 text-lg mb-2 cursor-pointer"
                            onClick={() => invite(invType.Secure)}
                        >
                            Extra Secure
                        </button>
                        <div class="text-sm">
                            Peer-to-peer voice and text chat for two participants, secured with asymmetric encryption, providing a
                            security level comparable to Ethereum blockchain technology.
                        </div>
                    </div>
                    <div class="p-4 rounded-md w-1/2 pb-4 text-center border border-slate-400">
                        <button class="bg-blue-600 hover:bg-blue-800 text-white w-full rounded py-1 text-lg mb-2 cursor-pointer">
                            Join
                        </button>
                        <div class="text-sm">Join a friend's ExtraSafe chat session via an invitation link.</div>
                    </div>
                </div>
                <div class="text-center mt-8 text-sm">
                    <div>
                        <b>ExtraSafe</b> is designed to be the best choice for private and secure communication. By utilizing
                        peer-to-peer connections and advanced asymmetric encryption, your conversations remain private and
                        protected, whether you're engaging in basic chat, advanced collaboration, or extra-secure messaging.
                    </div>
                    <div class="mt-4">Choose the option that meets your needs and connect with confidence.</div>
                </div>
            </div>
            {state.modal === 'invitation' && <Invitation type={type} close={closeModal}/>}
        </div>
    )
}
