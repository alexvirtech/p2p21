import LayoutModal from "../layouts/layoutModal"
import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import WithCopy from "../components/withCopy"

export default function AccountInfo({ close }) {
    const { state, dispatch } = useContext(Context)

    useEffect(() => {
        if (state.modal !== "info") return
        //alert(state.account)
    }, [state.modal])

    return (
        <LayoutModal title="Account Info" close={close}>
            <div>Account name</div>
            <div>
               <WithCopy>
                    <input
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"                        
                        disabled
                        value={state.account.name}
                    />
               </WithCopy>
            </div>
            <div class="pt-3">Public Key</div>
            <div>
                <WithCopy>
                    <textarea
                        onClick={(e) => navigator.clipboard.writeText(e.target.value)}
                        rows="2"
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"
                        disabled
                        value={state.account.wallet.publicKey}
                    />
                </WithCopy>
            </div>
            <div class="pt-3">Private Key</div>
            <div>
                <WithCopy>
                    <textarea
                        onClick={(e) => navigator.clipboard.writeText(e.target.value)}
                        rows="2"
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"
                        disabled
                        value={state.account.wallet.privateKey}
                    />
                </WithCopy>
            </div>
            <div class="pt-3">Mnemonic Words</div>
            <div>
                <WithCopy>
                    <textarea
                        onClick={(e) => navigator.clipboard.writeText(e.target.value)}
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"
                        disabled
                        rows="2"
                        value={state.account.wallet.mnemonic}
                    />
                </WithCopy>
            </div>
            <div class="pt-1">
                <button class="bg-blue-500 text-white rounded py-1.5 px-8 my-4 cursor-pointer" onClick={close}>
                    Close
                </button>
            </div>
        </LayoutModal>
    )
}
