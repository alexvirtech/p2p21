import { useState, useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"
import LayoutModal from "../layouts/layoutModal"
import { validateLink } from "../utils/utils"
import { AcceptIcon } from "../utils/icons"

export default function Join({ close }) {
    const { state, dispatch } = useContext(Context)
    const [error, setError] = useState("")
    const [link, setLink] = useState("")
    const [valid, setValid] = useState(false)
    const input = useRef()

    useEffect(() => {
        input.current.focus()
    }, [])

    useEffect(() => {
        const { valid, error } = validateLink(link)
        setValid(valid)
        if (link.trim() === "" || valid) {
            setError("")
        } else {
            setError(error)
        }
    }, [link])

    const handleJoin = () => {
        dispatch({ type: "CONNECT_EXT", payload: link })
    }

    return (
        <LayoutModal title="Join with Invitation Link" close={() => close()}>
            <div class="pb-1 pt-2 text-xl">
                <b title="basic mode">Join communication session</b>
            </div>
            <div class="pb-4 text-sm low:text-md">Paste invitation link into the text area in order to start.</div>
            <div class="flex justify-start gap-2 text-sm">
                <textarea
                    ref={input}
                    class="w-full border border-slate-400 rounded py-1.5 px-4"
                    rows={3}
                    onInput={(e) => setLink(e.target.value)}
                />
            </div>
            <div class="pt-1 flex justify-start gap-4">
                <button
                    type="button"
                    class={`h-auto ${
                        valid ? "bg-blue-500 hover:bg-blue-700" : "bg-slate-300"
                    }  text-white text-md items-center flex justify-center gap-2 py-2 px-4 rounded my-4 disabled:bg-gray-300`}
                    onClick={handleJoin}
                    desabled={!valid}
                >
                    <AcceptIcon />
                    <div>Accept Invitation</div>
                </button>
                <div class="text-red-600 my-5 text-xs">{error}</div>
            </div>
        </LayoutModal>
    )
}
