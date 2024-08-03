import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { createAccount } from "../utils/account"
import { useRef } from "preact/hooks"
import { encrypt } from "../utils/crypto"
import { addAccount, ifAccountExists } from "../utils/localDB"
import { defAccount, testIfOpened } from "../utils/common"

export default function CreateAccount({ close }) {
    const { state, dispatch } = useContext(Context)
    const nameInput = useRef()
    const [name, setName] = useState("")
    const [isOpened, setIsOpened] = useState(false)
    const password = useRef()
    const confirmPassword = useRef()
    const [error, setError] = useState("")

    useEffect(() => {
        nameInput.current.value = ""
        nameInput.current.focus()
    }, [])

    useEffect(() => {
        if (name !== "") setIsOpened(testIfOpened(name))
    }, [name])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (name.trim() === defAccount) {
            setError("Account already exists and cannot be recreated")
            return
        }
        const { publicKey, privateKey, mnemonic } = createAccount()
        const acc1 = {
            name,
            wallet: { publicKey, privateKey, mnemonic: mnemonic.phrase },
        }
        dispatch({ type: "ADD_ACCOUNT", payload: acc1 })
        if(testIfOpened(name)) {
            addAccount(acc1)
        }else{
            const acc2 = {
                name,
                encWallet: encrypt(JSON.stringify({ publicKey, privateKey, mnemonic: mnemonic.phrase }), password.current.value),
            }
            addAccount(acc2)
        }
        
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
                    <input
                        class="w-full border border-slate-400 rounded py-1.5 px-4"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        ref={nameInput}
                    />
                </div>
                {isOpened ? (
                    <div>Account names starting with 'Default' do not require a password.</div>
                ) : (
                    <>
                        <div class="pt-3">Password</div>
                        <div>
                            <input
                                class="w-full border border-slate-400 rounded py-1.5 px-4"
                                type="password"
                                required={!isOpened}
                                ref={password}
                            />
                        </div>
                        <div class="pt-3">Confirm password</div>
                        <div>
                            <input
                                class="w-full border border-slate-400 rounded py-1.5 px-4"
                                type="password"
                                required={!isOpened}
                                ref={confirmPassword}
                            />
                        </div>
                    </>
                )}
                <div class="pt-1 flex justify-start gap-4">
                    <button class="bg-blue-500 text-white rounded py-1.5 px-8 my-4 cursor-pointer" type="submit">
                        Create
                    </button>
                    <div class="text-red-600 my-5 text-xs">{error}</div>
                </div>
            </form>
        </LayoutModal>
    )
}
