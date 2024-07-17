import { useState, useEffect, useRef, useReducer } from "preact/hooks"
import { Context } from "./utils/context"
import { InitState, reducer } from "./utils/reducer"
import Chat from "./components/chat"
import Video from "./components/video"
import Status from "./components/status"
import Caller from "./components/caller"
import Screen from "./components/screen"

export function App() {
    const [state, dispatch] = useReducer(reducer, InitState)

    return (
        <Context.Provider value={{ state, dispatch }}>
            <div class="h-[100vh] flex flex-col">
                <div class="border-b border-gray-500 px-4">
                    <h1 class="text-2xl flex justify-center py-4">Communicator</h1>
                </div>

                <div class="grow flex justify-start gap-0">
                    {/* <div class="flex flex-col"> */}
                    <div class="p-4 grow flex flex-col min-h-0 max-w-[420px]">
                        <Caller />
                        <div class="grid grid-cols-2 gap-2 py-4 h-[200px]">
                            <Video stream={state.localStream} name="my video" />
                            <Video stream={state.remoteStream} name={"User 2"} />
                        </div>
                        <Chat />

                        {/*  <div class="grow">
                                   
                                </div> */}
                    </div>

                    {/* </div> */}
                    <div class="w-[600px] pb-4 pt-2 pr-4 h-full flex flex-col">
                        <div class="flex justify-start gap-0">
                            <div class="border border-gray-400 rounded-t py-1 px-4">Dashboard</div>
                            <div class="border-t border-l border-r border-gray-400 rounded-t py-1 px-4">Screen</div>
                            <div class="border border-gray-400 rounded-t py-1 px-4">Whiteboard</div>
                            <div class="border border-gray-400 rounded-t py-1 px-4">Documents</div>
                            <div class="grow border-b border-gray-400">&nbsp;</div>
                        </div>
                        <div class="grow border-b border-l border-r border-gray-400 rounded-b">
                            <Screen />
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t border-gray-400">
                    <Status isConnected={state.remoteStream} />
                </div>
            </div>
        </Context.Provider>
    )
}
