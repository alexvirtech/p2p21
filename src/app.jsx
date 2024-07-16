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
            <div class="max-w-[500px] mx-auto">
                <h1 class="text-2xl flex justify-center py-4">Communicator</h1>
                <Caller />
                <div class="flex justify-center gap-2 py-4 px-1 h-[200px]">
                    <Video stream={state.localStream} name="my video" />
                    <Video stream={state.remoteStream} name={'User 2'} />
                </div>

                <Chat />

                <Status isConnected={state.remoteStream} />
            </div>
        </Context.Provider>
    )
}
