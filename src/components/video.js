import { useRef, useEffect } from "preact/hooks"

const Video = ({ stream, name }) => {
    const videoRef = useRef(null)

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    return (
        <div className="video-container">
            <h2>{name}</h2>
            <video ref={videoRef} autoPlay playsInline muted />
        </div>
    )
}

export default Video
