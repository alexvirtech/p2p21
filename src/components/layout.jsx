import { Context } from "../utils/context"
import Title from "./title"
import CallerWithVideo from "./callerWithVideo"
import Chat from "./chat"
import Status from "./status"

const Layout = ({ state, dispatch, children }) => {
    return (
        <Context.Provider value={{ state, dispatch }}>
            <div class="h-[100vh] flex flex-col">
                <Title />

                <div class="grow flex justify-center gap-0">
                    <div class="flex flex-col">
                        <CallerWithVideo localStream={state.localStream} remoteStream={state.remoteStream} />
                        <Chat />
                    </div>
                    <div class="w-full py-4 pr-4 flex flex-col max-w-[1000px]">
                        <div class="flex justify-start gap-4">
                            {state.tabs.map((t) => (
                                <button
                                    onClick={() => dispatch({ type: "SET_TAB", payload: { tab: t } })}
                                    class={"font-bold " + (t === state.tab ? "text-gray-700" : "text-blue-500 hover:underline")}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div class="grow border border-gray-400 rounded p-4">{children}</div>
                    </div>
                </div>

                <Status isConnected={state.remoteStream} />
            </div>
        </Context.Provider>
    )
}

export default Layout
