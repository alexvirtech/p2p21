import { useState, useEffect, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { invType } from "../utils/common"
import Invitation from "../modals/invitation"
import InvButton from "./invButton"
import Join from "../modals/join"

export default function InviteButtons() {
    const { state, dispatch } = useContext(Context)

    const closeModal = () => {
        dispatch({ type: "SET_MODAL", payload: null })
    }

    return (
        <div class="flex justify-center items-center h-full w-full">
            <div class="w-full landscape:max-w-[600px]">
                <div class="flex justify-center gap-0">
                    <InvButton title={invType.Basic} />
                    <InvButton title={invType.Advanced} />
                </div>
                <div class="flex justify-center gap-0 mt-0">
                    <InvButton title={invType.Secure} />
                    <InvButton title={invType.Join} />
                </div>
                <div class="mt-4 text-center">Choose the option that meets your needs and connect with confidence.</div>
                {/* <div class="text-center mt-0 text-[11px] tablet:text-sm">
                    <div class="hidden">
                        <b>ExtraSafe</b> is designed to be the best choice for private and secure communication. By utilizing
                        peer-to-peer connections and advanced asymmetric encryption, your conversations remain private and
                        protected, whether you're engaging in basic chat, advanced collaboration, or extra-secure messaging.
                    </div>
                    <div class="mt-4 text-[13px]">Choose the option that meets your needs and connect with confidence.</div>
                </div> */}
            </div>
            {state.modal === "invitation" && <Invitation close={closeModal} />}
            {state.modal === "join" && <Join close={closeModal} />}
        </div>
    )
}
