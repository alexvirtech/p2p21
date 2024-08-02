import { useRef, useEffect } from "preact/hooks"

export default function Video ({ stream, name }) {
    const videoRef = useRef(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    return <div class="w-full h-full">
            {/* {name && <div>{name}</div>} */}
            <video ref={videoRef} controls autoplay muted playsinline="true" webkit-playsinline="true" class="w-full h-full object-cover overflow-hidden rounded-md rotate-y-180"/>
        </div>
}