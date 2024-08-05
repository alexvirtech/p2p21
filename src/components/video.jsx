import { useRef, useEffect } from "preact/hooks"

export default function Video({ stream, name }) {
    const videoRef = useRef(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream

            const handleLoadedMetadata = () => {
                // Enforce video size to fit within its parent container
                videoRef.current.style.width = "100%"
                videoRef.current.style.height = "100%"
                videoRef.current.style.objectFit = "contain"
            }

            videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)

            return () => {
                videoRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
            }
        }
    }, [stream])

    return (
        <div class="relative w-full h-full overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
                <video
                    ref={videoRef}
                    controls
                    autoplay
                    muted
                    playsinline
                    webkit-playsinline="true"
                    class="max-h-full max-w-full object-contain overflow-hidden rounded rotate-y-180"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    )
}
