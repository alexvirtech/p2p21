import {useState,useEffect} from 'preact/hooks'

export const useStream = () => {
    const [localStream, setLocalStream] = useState(null)

    useEffect(() => {
        init()
    }, [])
    
    const init = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            setLocalStream(stream)
        } catch (error) {
            console.error("Error accessing media devices.", error)
        }
    }

    return { localStream }
}