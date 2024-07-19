import Caller from "./caller"
import Video from "./video"

const CallerWithVideo = ({ localStream, remoteStream }) => (
    <div class="px-4 pt-4 pb-0 flex flex-col min-h-0 max-w-[420px]">
        <Caller />
        <div class="grid grid-cols-2 gap-2 py-4 h-[200px]">
            <div class="border border-gray-400 rounded p-2 pt-0">
                <Video stream={localStream} name="my video" />
            </div>
            <div class="border border-gray-400 rounded p-2 pt-0">
                {remoteStream ? (
                    <Video stream={remoteStream} name={"User 2"} />
                ) : (
                    <div>not connected</div>
                )}
            </div>
        </div>
    </div>
)

export default CallerWithVideo
