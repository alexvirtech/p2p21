import { ethers } from "ethers"

export async function EncryptText(text, publicKey) {
    try {
        const compressedPublicKey = ethers.utils.computePublicKey(publicKey, true)
        const aesKey = ethers.randomBytes(32)
        const iv = ethers.randomBytes(16)
        const aesKeyHex = ethers.hexlify(aesKey)
        const ivHex = ethers.hexlify(iv)
        const cipher = ethers.utils.AesGcm(aesKeyHex)
        const encryptedText = await cipher.encrypt(ivHex, ethers.utils.toUtf8Bytes(text))
        const encryptedAesKey = ethers.computeSharedSecret(publicKey, aesKey)
        return {
            encryptedText: ethers.hexlify(encryptedText),
            encryptedAesKey: ethers.hexlify(encryptedAesKey),
            iv: ivHex,
        }
    } catch (error) {
        console.error("Error in EncryptText:", error)
        throw error
    }
}

export async function DecryptText(encryptedText, encryptedAesKey, iv, privateKey) {
    try {
        const aesKey = ethers.computeSharedSecret(privateKey, encryptedAesKey)
        const cipher = ethers.utils.AesGcm(aesKey)
        const decryptedText = await cipher.decrypt(iv, ethers.utils.arrayify(encryptedText))
        return ethers.utils.toUtf8String(decryptedText)
    } catch (error) {
        console.error("Error in DecryptText:", error)
        throw error
    }
}

export async function EncryptStream(stream, senderPrivateKey, recipientPublicKey) {
    try {
        // Generate a random AES key and initialization vector (IV)
        const aesKey = ethers.randomBytes(32)
        const iv = ethers.randomBytes(16)

        // Convert AES key and IV to hex strings
        const aesKeyHex = ethers.hexlify(aesKey)
        const ivHex = ethers.hexlify(iv)

        // Create an empty MediaStream for encrypted tracks
        const encryptedStream = new MediaStream()

        // Sender's private key (must be securely managed in practice)
        //const senderPrivateKey = "0xYOUR_PRIVATE_KEY" // Replace with the actual sender's private key

        // Validate the private key
        if (!senderPrivateKey || !recipientPublicKey) {
            throw new Error("Private key or public key is missing or invalid.")
        }

        // Create a SigningKey object with the sender's private key
        const signingKey = new ethers.SigningKey(senderPrivateKey)

        // Compute the shared secret using the sender's private key and recipient's public key
        const sharedSecret = signingKey.computeSharedSecret(recipientPublicKey)

        // Encrypt the AES key using the shared secret
        const encryptedAesKey = ethers.hexlify(sharedSecret)

        // Encrypt each track in the stream
        for (const track of stream.getTracks()) {
            const encryptedTrack = track.clone()
            encryptedTrack.ondata = async (data) => {
                const cipher = new ethers.AesGcm(aesKeyHex)
                const encryptedData = await cipher.encrypt(ivHex, data)
                encryptedTrack.dispatchEvent(new CustomEvent("data", { detail: encryptedData }))
            }
            encryptedStream.addTrack(encryptedTrack)
        }

        // Return the encrypted stream, encrypted AES key, and IV
        return { encryptedStream, encryptedAesKey, iv: ivHex }
    } catch (error) {
        console.error("Error in EncryptStream:", error)
        throw error
    }
}

export async function DecryptStream(encryptedStream, encryptedAesKey, iv, privateKey) {
    try {
        // Ensure that the private key is valid and properly formatted
        if (!privateKey) {
            throw new Error("Private key is missing or invalid.")
        }

        // Create a SigningKey object with the provided private key
        const signingKey = new ethers.SigningKey(privateKey)

        // Compute the shared secret using the private key and the encrypted AES key (recipient's public key)
        const aesKey = signingKey.computeSharedSecret(encryptedAesKey)

        // Convert AES key and IV to hex strings
        const aesKeyHex = ethers.hexlify(aesKey)
        const ivHex = ethers.hexlify(iv)

        // Create a new MediaStream for decrypted tracks
        const decryptedStream = new MediaStream()

        // Decrypt each track in the encrypted stream
        for (const track of encryptedStream.getTracks()) {
            const decryptedTrack = track.clone()
            decryptedTrack.ondata = async (encryptedData) => {
                const cipher = new ethers.AesGcm(aesKeyHex)
                const decryptedData = await cipher.decrypt(ivHex, encryptedData)
                decryptedTrack.dispatchEvent(new CustomEvent("data", { detail: decryptedData }))
            }
            decryptedStream.addTrack(decryptedTrack)
        }

        return decryptedStream
    } catch (error) {
        console.error("Error in DecryptStream:", error)
        throw error
    }
}

export const streamToBase64 = async (stream) => {
    if (!(stream instanceof MediaStream)) {
        console.error("Provided stream is not a valid MediaStream:", stream)
        throw new TypeError("Provided stream is not a valid MediaStream")
    }

    return new Promise((resolve, reject) => {
        const chunks = []
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" })
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1] // Get the base64 part
                resolve(base64String)
            }
            reader.onerror = (error) => reject(error)
            reader.readAsDataURL(blob) // Convert blob to base64 string
        }

        mediaRecorder.start()
        setTimeout(() => {
            mediaRecorder.stop()
        }, 1000) // Record for 1 second
    })
}
