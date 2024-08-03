import { decrypt } from "../utils/crypto"
import LayoutModal from "./layoutModal"
import { useState, useRef, useContext } from "preact/hooks"
import { Context } from "../utils/context"

export default function LayoutModalWithPassword({
    children,
    title,
    close = () => {},
    width = "w-[90%] max-w-[600px]",
    mt = "mt-[5%]",
}) {
    const { state, dispatch } = useContext(Context)
    const password = useRef()
    const [show, setShow] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        //close(password.current.value)
        //const acc = state.accounts.find((a) => a.name === state.account)
        //const wallet = decrypt(localStorage.getItem("wallet"), password.current.value)
    }

    return (
        <LayoutModal title={title} close={close} width={width} mt={mt}>
            {show ? (
                <>{children}</>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div class="pt-3">Password</div>
                    <div>
                        <input
                            class="w-full border border-slate-400 rounded py-1.5 px-4"
                            type="password"
                            required
                            ref={password}
                        />
                    </div>
                    <div class="pt-1">
                        <button class="bg-blue-500 text-white rounded py-1.5 px-8 my-4 cursor-pointer">Create</button>
                    </div>
                </form>
            )}
        </LayoutModal>
    )
}
