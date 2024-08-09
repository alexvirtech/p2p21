import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"

const LayoutDash = ({ video, monitor, chat }) => {
    const { state, dispatch } = useContext(Context)
    const [containerStyle, setContainerStyle] = useState({})

    // temp block for layout testing
    const Block = ({ title }) => {
        return <div class="h-full w-full border border-gray-400 rounded text-sm text-center">{title}</div>
    }

    const VideoSet = ({ videos }) => {
        return state.isMonitor || state.isChat ? (
            <div class="gap-2 w-full max-w-[30%] mx-auto flex landscape:flex-col portrait:justify-start portrait:max-w-full portrait:h-[25%]">
                {videos.map((video, i) => (
                    <div key={i} class="aspect-w-1 aspect-h-1 portrait:h-full landscape:h-full w-1/2 landscape:w-full">
                        {video}
                    </div>
                ))}
            </div>
        ) : (
            <div class="gap-2 w-full max-w-[1000px] mx-auto flex landscape:justify-start portrait:flex-col portrait:gap-4 grow">
                {videos.map((video, i) => (
                    <div key={i} class="aspect-w-1 aspect-h-1 portrait:h-1/2 landscape:h-full landscape:w-1/2">
                        {video}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div class="h-full w-full">
            <div class="landscape:flex landscape:justify-between gap-4 w-full h-full px-4 low:px-8 low:py-4 portrait:flex portrait:flex-col">
                {state.isConnected ? (                
                    <>                       
                        <VideoSet
                            videos={video}
                        />                       
                        {state.isMonitor && <div class="grow">{monitor ?? <Block title="Temp" />}</div>}
                        {state.isChat && (
                            <div class={`${state.isMonitor ? "landscape:w-[33%]" : "grow"}  h-full w-full portrait:h-[33%]`}>
                                {chat ?? <Block title="chat" />}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div class="w-full landscape:h-full landscape:max-w-[1000px] portrait:grow portrait:w-full mx-auto">
                            <div class={`w-full h-full flex justify-center items-center gap-2 portrait:flex portrait:flex-col`}>
                                {video[0] ?? <Block title="my video" />}
                            </div>
                        </div>                        
                    </>
                )}
            </div>
        </div>
    )
}

export default LayoutDash
