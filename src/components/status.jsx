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
        <div class="text-center">{isConnected ? "Connected" : "Not connected"}</div>
        {state.account && <div>{state.account.name}</div>}
        <div>{state.peer?.id}</div>
    </div>
}
