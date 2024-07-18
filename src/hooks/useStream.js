import { useState, useEffect } from "preact/hooks"

export const useStream = (type = "video") => {
    const [localStream, setLocalStream] = useState(null)

    useEffect(() => {
        initStream()
    }, [type])

    const initStream = async () => {
        try {
            const stream = type === "video"
                ? await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                : await navigator.mediaDevices.getDisplayMedia({ video: true })
            setLocalStream(stream)
        } catch (error) {
            console.error("Error accessing media devices.", error)
        }
    }

    return { localStream }
}
