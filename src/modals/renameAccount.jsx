import { useState, useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { renameAccount } from "../utils/localDB"

export default function RenameAccount({ close }) {
    const { state, dispatch } = useContext(Context)
    const [error, setError] = useState("")
    const password = useRef()
    const newName = useRef()

    useEffect(() => {
        newName.current.value = ''   
        newName.current.focus()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()       
        const err = renameAccount(state.account.name,newName.current.value,password.current.value)
        if (err) {
            setError(err)
            return
        }
        dispatch({type:'RENAME_ACCOUNT',payload:newName.current.value})
        close()
    }

    return (
        <LayoutModal title="Rename Account" close={close}>
            <form onSubmit={handleSubmit}>
                <div>Account name</div>
                <div>
                    <input
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"
                        disabled
                        value={state.account.name}
                    />
                </div>
                <div>New name</div>
                <div>
                    <input
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"
                        required
                        ref={newName}
                    />
                </div>
                <div class="pt-3">Password</div>
                <div>
                    <input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required ref={password}/>
                </div>

                <div class="pt-1 flex justify-start gap-4">
                    <button class="bg-blue-500 text-white rounded py-1.5 px-8 my-4 cursor-pointer" type="submit">
                        Submit
                    </button>
                    <div class="text-red-600 my-5 text-xs">{error}</div>
                </div>
            </form>
        </LayoutModal>
    )
}