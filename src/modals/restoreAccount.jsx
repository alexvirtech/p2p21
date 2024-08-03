import { useState, useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { restoreAccount } from "../utils/localDB"
import { defAccount, testIfOpened } from "../utils/common"
import { decrypt } from "../utils/crypto"

export default function RestoreAccount({ close }) {
    const { state, dispatch } = useContext(Context)
    const [error, setError] = useState("")
    const password = useRef()
    const backup = useRef()

    useEffect(() => {
        backup.current.value = ''   
        backup.current.focus()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()       
        const err = restoreAccount(backup.current.value,password.current.value)
        if (err) {
            setError(err)
            return
        }        
        const acc = JSON.parse(backup.current.value)
        const wallet = testIfOpened(acc.name) ?  acc.wallet : JSON.parse(decrypt(acc.encWallet, password.current.value))
        const account = {
            name: acc.name,
            wallet: wallet
        }        
        dispatch({ type: "ADD_ACCOUNT", payload: account })        
        close()
    }

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("")
            }, 5000)
        }
    }, [error])
    
    return (
        <LayoutModal title="Restore Account" close={close}>
            <form onSubmit={handleSubmit}>
                <div>Backup</div>
                <div>
                    <textarea
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"
                        required
                        rows="6"
                        ref={backup}
                    />
                </div>                
                <div class="pt-3">Password</div>
                <div>
                    <input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required ref={password}/>
                </div>

                <div class="pt-1 flex justify-start gap-4 items-top">
                    <button class="bg-blue-500 text-white rounded py-1.5 px-8 my-4 cursor-pointer h-fit" type="submit">
                        Submit
                    </button>
                    <div class="min-h-10 items-center"><div class="text-red-600 my-5 text-xs">{error}</div></div>
                </div>
            </form>
        </LayoutModal>
    )
}