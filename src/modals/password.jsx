import { decrypt } from "../utils/crypto"
import LayoutModal from "../layouts/layoutModal"
import { useState, useRef, useContext, useEffect } from "preact/hooks"
import { Context } from "../utils/context"

export default function Password({ name, title, close = () => {}, width = "w-[90%] max-w-[600px]", mt = "mt-[5%]" }) {
    const { state, dispatch } = useContext(Context)
    const password = useRef()
    const [show, setShow] = useState(false)

    useEffect(() => {
        if(state.modal!=='password') return
        password.current.value = ''
        password.current.focus()
    },[])

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            const acc = state.accounts.find((a) => a.name === name)
            const wallet = decrypt(acc.encWallet, password.current.value)
            dispatch({ type: "SET_ACCOUNT", payload: { name, wallet: JSON.parse(wallet) } })    
            closeModal()     
        } catch (e) {
            console.log(e)
        } finally {
            //
        }
    }

    const closeModal = () => {
        setShow(false)
        dispatch({ type: "SET_MODAL", payload: null })
        //close()
    }

    return (
        <LayoutModal title={title} close={close} width={width} mt={mt}>
            <form onSubmit={handleSubmit}>
                <div class="pt-3">Password</div>
                <div>
                    <input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required ref={password} />
                </div>
                <div class="pt-1">
                    <button class="bg-blue-500 text-white rounded py-1.5 px-8 my-4 cursor-pointer">Submit</button>
                </div>
            </form>
        </LayoutModal>
    )
}
