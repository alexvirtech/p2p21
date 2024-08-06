import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"

const LayoutDash = ({ video, monitor, chat, invite }) => {
    const { state, dispatch } = useContext(Context)
    const [containerStyle, setContainerStyle] = useState({})
    // temp block for layout testing
    const Block = ({ title }) => {
        return <div class="h-full w-full border border-gray-400 rounded text-sm text-center">{title}</div>
    }

    const calculateDimensions = () => {
        const portraitMode = window.matchMedia("(orientation: portrait)").matches
        const connectionsCount = state.connections + 1

        if (portraitMode) {
            const height = `calc(100vw / ${connectionsCount})`
            setContainerStyle({
                height,
                width: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${connectionsCount}, 1fr)`,
                gridTemplateRows: "1fr", // Make sure rows are equal height
            })
        } else {
            const width = `calc(100vh / ${connectionsCount})`
            setContainerStyle({
                width,
                height: "100%",
                display: "grid",
                gridTemplateRows: `repeat(${connectionsCount}, 1fr)`,
                gridTemplateColumns: "1fr", // Make sure columns are equal width
            })
        }
    }

    useEffect(() => {
        // Calculate dimensions initially
        calculateDimensions()

        // Listen for orientation changes
        const handleOrientationChange = () => {
            calculateDimensions()
        }

        window.addEventListener("resize", handleOrientationChange)

        return () => {
            window.removeEventListener("resize", handleOrientationChange)
        }
    }, [state.connections])

    return (
        <div class="h-full w-full">
            <div class="landscape:flex landscape:justify-between gap-4 w-full h-full px-4 low:px-8 low:py-4 portrait:flex portrait:flex-col">
                {state.isConnected ? (
                    <>
                        {state.isVideo && <div class="gap-2" style={containerStyle}>
                            <div class="aspect-w-1 aspect-h-1">
                                {/* <Block title="my video" /> */}
                                {video[0] ?? <Block title="my video" />}
                            </div>
                            {new Array(state.connections).fill(null).map((_, i) => (
                                <div class="aspect-w-1 aspect-h-1">
                                    {/* <Block title={`user ${i + 2}`} /> */}
                                    {video[i+1] ?? <Block title={`user ${i + 2}`} />}
                                </div>
                            ))}
                        </div>}

                        <div class="grow">
                            {/* <Block title="Temp" /> */}
                            {monitor ?? <Block title="Temp" />}
                        </div>
                        {state.isChat && (
                            <div class="landscape:w-[33%] h-full w-full portrait:h-[33%]">
                               {/*  <Block title="chat" /> */}
                                 {chat ?? <Block title="chat" />}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div class="landscape:h-full landscape:w-1/2 portrait:max-h-1/2 portrait:grow portrait:w-full">
                            <div class={`w-full h-full flex justify-center items-center gap-2 portrait:flex portrait:flex-col`}>
                                {/* <Block title="my video" /> */}
                                {video[0] ?? <Block title="my video" />}
                            </div>
                        </div>
                        <div class="landscape:w-1/2 portrait:w-full portrait:min-h-[33%]">
                            {/* <Block title="InviteButtons" /> */}
                            {invite ?? <Block title="InviteButtons" />}
                        </div>
                    </>
                )}
            </div>
            {/* <aside class="absolute bottom-0 left-0 p-4 text-xs text-gray-500 bg-gray-200 h-full">123</aside> */}
        </div>
    )
}

export default LayoutDash
