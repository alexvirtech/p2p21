import { useContext, useEffect } from "preact/hooks"
import { Context } from "../utils/context"

export default function Status({ isConnected }) {
    const { state, dispatch } = useContext(Context)

    useEffect(() => {
        if (state.peer) {
            console.log(state.peer)
        }
    }, [state.peer])

    return <div class="p-2 low:p-4 border-t border-gray-400 text-sm h-[62px]">
        <div class="text-sm max-w-screen">
            <div class="text-center pb-1">{isConnected ? "Connected" : "Not connected"}</div>
            <div class="flex justify-center gap-2 w-full max-w-screen px-4">
                {/* {state.account && <div class="bold">{state.account.name}</div>} */}
                <div class="truncate w-full text-center">{state.peer?.id}</div>
            </div>
        </div>
    </div>
}
