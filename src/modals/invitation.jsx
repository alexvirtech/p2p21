import { useState, useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { renameAccount } from "../utils/localDB"
import WithCopy from "../components/withCopy"
import { ShareIcon } from "../utils/icons"
import Router, { route } from "preact-router"
import { capitalize,shareLink } from "../utils/utils"
import {invType} from "../utils/common"
import InvButtonItems from "../components/invButtonItems"

export default function Invitation({ close }) {
    const { state, dispatch } = useContext(Context)
    const [error, setError] = useState("")
    const [item, setItem] = useState()
    const [link, setLink] = useState("")

    useEffect(() => {
        console.log("Invitation type:", state.mode)       
        const l = `${window.location.origin}/?id=${state.address}&tp=${state.mode}&pk=${state.account.wallet.publicKey}`
        setLink(l)
    }, [state.modal])    

    return (
        <LayoutModal title="Invitation Link" close={() => close()}>
            <div class="pb-1 pt-2 text-xl">
                <b title="basic mode">{`${capitalize(state.mode)} mode`}</b>                
            </div>
            <div class="pb-4 text-sm low:text-md"><InvButtonItems title={state.mode}/></div>
            <div class="flex justify-start gap-2 text-sm">
                <WithCopy>
                    <textarea
                        class="w-full border border-slate-400 rounded py-1.5 px-4"
                        rows={3}
                        disabled
                        value={link}
                    />
                </WithCopy>
            </div>
            <div class="text-sm">Click to copy and send or share the link with your friend in order to start.</div>
            <div class="pt-1 flex justify-start gap-4">
                <button
                    type="button"
                    class="h-auto bg-blue-500 hover:bg-blue-700 text-white font-bold flex justify-center py-2 px-8 rounded my-4"
                    onClick={()=>shareLink(link,link)}
                >
                    Share
                </button>
                <div class="text-red-600 my-5 text-xs">{error}</div>
            </div>
        </LayoutModal>
    )
}
