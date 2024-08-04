import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { invButtonItems, invType } from "../utils/common"
import Invitation from "../modals/invitation"
import InvButton from "./invButton"

export default function InviteButtons() {
    const { state, dispatch } = useContext(Context)
    const [type, setType] = useState(invType.Basic)
    
    const invite = (type) => {        
        setType(type)
        if(type === invType.Join){
            // 
        }else{
            dispatch({ type: "SET_MODAL", payload: "invitation" })
        }
        
    }

    const closeModal = () => {
        dispatch({type:'SET_MODAL',payload:null})
    }

    return (
        <div class="flex justify-center items-center h-full w-full">
            <div class="w-full landscape:max-w-[600px]">
                <div class="flex justify-center gap-4">
                {
                        [...invButtonItems].slice(0,2).map((item, i) => <InvButton key={i} invite={invite} title={item.title} description={item.description} />)

                    }                    
                </div>
                <div class="flex justify-center gap-4 mt-4">
                    {
                        [...invButtonItems].slice(2,4).map((item, i) => <InvButton key={i} invite={invite} title={item.title} description={item.description} />)

                    }                       
                </div>
                <div class="text-center mt-8 text-[11px] tablet:text-sm">
                    <div class="hidden low:block">
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
