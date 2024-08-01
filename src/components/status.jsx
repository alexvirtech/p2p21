import { useContext } from "preact/hooks"
import { Context } from "../utils/context"

export default function Status({ isConnected }) {
    const { state, dispatch } = useContext(Context)

    return <div class="p-4 border-t border-gray-400 flex justify-center gap-4">
        <div class="text-center">{isConnected ? "Connected" : "Not connected"}</div>
        {state.account && <div>{state.account.name}</div>}
    </div>
}
