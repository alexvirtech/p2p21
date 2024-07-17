import { useState, useEffect, useRef, useReducer } from "preact/hooks"
import { Context } from "./utils/context"
import { InitState, reducer } from "./utils/reducer"
import Chat from "./components/chat"
import Video from "./components/video"
import Status from "./components/status"
import Caller from "./components/caller"

export function App() {
    const [state, dispatch] = useReducer(reducer, InitState)

    return (
        <Context.Provider value={{ state, dispatch }}>
            <div class="h-[100vh] flex flex-col">
                <div class="border-b border-gray-500 px-4">
                    <h1 class="text-2xl flex justify-center py-4">Communicator</h1>
                </div>
                <div class="p-4 max-w-[420px] grow flex flex-col min-h-0">
                    <Caller />
                    <div class="grid grid-cols-2 gap-2 py-4 h-[200px]">
                        <Video stream={state.localStream} name="my video" />
                        <Video stream={state.remoteStream} name={"User 2"} />
                    </div>
                    <Chat />
                </div>
                <div class="p-4 border-t border-gray-400">
                    <Status isConnected={state.remoteStream} />
                </div>
            </div>
        </Context.Provider>
    )
}
