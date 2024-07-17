
export default function Video({ stream, name }) {
    return (
        <div class="w-full border border-gray-400 p-2 rounded h-full flex flex-col items-center justify-center">
            {stream ? (
                <video autoplay muted srcObject={stream} class="w-full h-full object-cover"></video>
            ) : (
                <div class="flex flex-col items-center justify-center w-full h-full">
                    <div>{name}</div>
                    <div class="text-sm">is not connected</div>
                </div>
            )}
        </div>
    )
}
