import { useState, useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { changeAccountPassword } from "../utils/localDB"

export default function ChangePassword({ close }) {
    const { state, dispatch } = useContext(Context)
    const [error, setError] = useState("")
    const password = useRef()
    const newPassword = useRef()
    const confirmPassword = useRef()
    const newName = useRef()

    useEffect(() => {
        password.current.value = ''   
        password.current.focus()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()       
        const err = changeAccountPassword(state.account.name,newPassword.current.value,password.current.value)
        if (err) {
            setError(err)
            return
        }
        dispatch({type:'CHANGE_PASSWORD',payload:newPassword.current.value})
        close()
    }

    return (
        <LayoutModal title="Change Password" close={close}>
            <form onSubmit={handleSubmit}>
                <div>Account name</div>
                <div>
                    <input
                        class="w-full border border-slate-400 rounded py-1.5 px-4 text-sm"
                        disabled
                        value={state.account.name}
                    />
                </div>                
                <div class="pt-3">Current Password</div>
                <div>
                    <input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required ref={password}/>
                </div>
                <div class="pt-3">New Password</div>
                <div>
                    <input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required ref={newPassword}/>
                </div>
                <div class="pt-3">Confirm password</div>
                <div>
                    <input
                        class="w-full border border-slate-400 rounded py-1.5 px-4"
                        type="password"
                        required
                        ref={confirmPassword}
                    />
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