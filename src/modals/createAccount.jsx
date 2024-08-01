import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { createAccount } from "../utils/account"
import { useRef } from "preact/hooks"
import { encrypt } from "../utils/crypto"
import { addAccount, ifAccountExists } from "../utils/localDB"

export default function CreateAccount({ close }) {
    const { state, dispatch } = useContext(Context)
    const name = useRef()
    const password = useRef()
    const confirmPassword = useRef()
    const [error, setError] = useState("")

    useEffect(() => {
        if (state.modal !== "create") return     
        name.current.value = ''   
        name.current.focus()
    }, [state.modal])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (ifAccountExists(name.current.value)) {
            setError("Account already exists")
            return
        }
        const { publicKey, privateKey, mnemonic } = createAccount()
        const acc1 = {
            name: name.current.value,
            wallet: { publicKey, privateKey, mnemonic: mnemonic.phrase },
        }
        dispatch({ type: "ADD_ACCOUNT", payload: acc1 })
        const acc2 = {
            name: name.current.value,
            encWallet: encrypt(JSON.stringify({ publicKey, privateKey, mnemonic: mnemonic.phrase }), password.current.value),
        }
        addAccount(acc2)
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
        <LayoutModal title="Create Account" close={close}>
            <form onSubmit={handleSubmit}>
                <div>Account name</div>
                <div>
                    <input class="w-full border border-slate-400 rounded py-1.5 px-4" required ref={name} />
                </div>
                <div class="pt-3">Password</div>
                <div>
                    <input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required ref={password} />
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
                    <button class="bg-blue-500 text-white rounded py-1.5 px-8 my-4 cursor-pointer" type="submit">Create</button>
                    <div class="text-red-600 my-5">{error}</div>
                </div>
            </form>
        </LayoutModal>
    )
}
