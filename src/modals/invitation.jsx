import { useState, useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import WithCopy from "../components/withCopy"
import { ShareIcon } from "../utils/icons"
import { capitalize, shareLink } from "../utils/utils"

export default function Invitation({ close }) {
    const { state, dispatch } = useContext(Context)
    const [error, setError] = useState("")
    const [link, setLink] = useState("")

    useEffect(() => {
        console.log("Invitation type:", state.mode)
        const l = `${window.location.origin}/?id=${state.address}&pk=${state.account.wallet.publicKey}`
        setLink(l)
    }, [state.modal])

    return (
        <LayoutModal title="Invitation Link" close={() => close()}>
            <div class="pb-1 pt-2 text-xl">
                <b>Start Private & Secure chat</b>
            </div>
            <div class="pb-4 text-sm low:text-md">
                <span>Invitation link for</span>&nbsp;<b class="text-slate-500">peer-to-peer</b> video and text chat, using{" "}
                <b class="text-slate-500">asymmetric encryption</b> and providing a{" "}
                <b class="text-slate-500">blockchain privacy and security level</b>.
            </div>
            <div class="flex justify-start gap-2 text-sm">
                <WithCopy>
                    <textarea class="w-full border border-slate-400 rounded py-1.5 px-4" rows={3} disabled value={link} />
                </WithCopy>
            </div>
            <div class="text-sm">Click to copy and send or share the link with your friend in order to start.</div>
            <div class="pt-1 flex justify-start gap-4">
                <button
                    type="button"
                    class="h-auto bg-blue-500 hover:bg-blue-700 text-white text-md items-center flex justify-center py-2 px-4 rounded my-4 gap-2"
                    onClick={() => shareLink(link, link)}
                >
                    <ShareIcon />
                    <div>Share</div>
                </button>
                <div class="text-red-600 my-5 text-xs">{error}</div>
            </div>
        </LayoutModal>
    )
}
