import { useContext, useEffect } from "preact/hooks"
import { Context } from "../utils/context"

export default function Status({ isConnected }) {
    const { state, dispatch } = useContext(Context)

    useEffect(() => {
        if (state.peer) {
            console.log(state.peer)
        }
    }, [state.peer])

    return <div class="p-4 border-t border-gray-400 flex justify-center gap-4">
        <div class="text-sm">
            <div class="text-center pb-1">{isConnected ? "Connected" : "Not connected"}</div>
            <div class="flex justify-center gap-2">
                {state.account && <div class="bold">{state.account.name}</div>}
                <div class="truncate">{state.peer?.id}</div>
            </div>
        </div>
    </div>
}
