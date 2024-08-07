import { useState, useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { renameAccount } from "../utils/localDB"
import WithCopy from "../components/withCopy"
import { ShareIcon } from "../utils/icons"
import Router, { route } from 'preact-router'

export default function Invitation({ close }) {
    const { state, dispatch } = useContext(Context)
    const [error, setError] = useState("")
    //const [invUrl, setInvUrl] = useState("")

    useEffect(() => {
        //
        console.log("Invitation type:", state.mode)        
    }, [])

    const handleShare = () => {}

    return (
        <LayoutModal title="Share Invitation Link" close={()=>close()}>
            <div class="flex justify-between gap-2 pb-1 pt-2">
                <div>Invitation link</div>
                <b title="basic mode">{state.mode}</b>
            </div>            
            <div class="flex justify-start gap-2">
                <WithCopy>
                    <textarea
                        class="w-full border border-slate-400 rounded py-1.5 px-4"
                        rows={4}
                        disabled
                        value={`${window.location.origin}/?id=${state.address}&tp=${state.mode}&pk=${state.account.wallet.publicKey}` }
                    />
                </WithCopy>
            </div>
            <div class="text-sm">
                Click to copy and send or share the link with your friend in order to start.
            </div>
            <div class="pt-1 flex justify-start gap-4">
                <button
                    type="button"
                    class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold flex justify-center py-2 px-8 rounded my-4"
                    onClick={handleShare}
                >
                    Share
                </button>
                <div class="text-red-600 my-5 text-xs">{error}</div>
            </div>
        </LayoutModal>
    )
}
