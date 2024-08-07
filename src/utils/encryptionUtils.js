/* *********** NOT IN USE ************** */

// encryptionUtils.js

export const hexStringToArrayBuffer = (hexString) => {
    if (hexString.length % 2 !== 0) {
        throw new Error("Invalid hexString")
    }
    const arrayBuffer = new Uint8Array(hexString.length / 2)
    for (let i = 0; i < hexString.length; i += 2) {
        arrayBuffer[i / 2] = parseInt(hexString.substr(i, 2), 16)
    }
    return arrayBuffer.buffer
}

export const importPrivateKey = async (hexPrivateKey) => {
    const privateKeyArrayBuffer = hexStringToArrayBuffer(hexPrivateKey)
    return await crypto.subtle.importKey(
        "raw",
        privateKeyArrayBuffer,
        { name: "ECDSA", namedCurve: "P-256" }, // or "P-521" depending on your key type
        true,
        ["decrypt"],
    )
}

export const importPublicKey = async (hexPublicKey) => {
    const publicKeyArrayBuffer = hexStringToArrayBuffer(hexPublicKey)
    return await crypto.subtle.importKey(
        "raw",
        publicKeyArrayBuffer,
        { name: "ECDH", namedCurve: "P-256" }, // use ECDH for key derivation
        true,
        [],
    )
}

export const deriveSharedSecret = async (privateKey, publicKey) => {
    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: "ECDH",
            public: publicKey,
        },
        privateKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
    )
    return derivedKey
}

export const encryptStream = async (stream, publicKey) => {
    const encryptedStream = new MediaStream()
    const derivedKey = await deriveSharedSecret(await importPrivateKey(state.account.privateKey), publicKey)
    for (const track of stream.getTracks()) {
        const sender = new RTCRtpSender(track, stream)
        const encParams = await encryptTrack(sender, derivedKey)
        encryptedStream.addTrack(encParams.encryptedTrack)
    }
    return encryptedStream
}

export const decryptStream = async (encryptedStream, privateKey) => {
    const decryptedStream = new MediaStream()
    const derivedKey = await deriveSharedSecret(privateKey, await importPublicKey(state.recipient))
    for (const track of encryptedStream.getTracks()) {
        const receiver = new RTCRtpReceiver(track, encryptedStream)
        const decParams = await decryptTrack(receiver, derivedKey)
        decryptedStream.addTrack(decParams.decryptedTrack)
    }
    return decryptedStream
}

const encryptTrack = async (sender, derivedKey) => {
    const encryptedTrack = sender.track.clone()
    // Logic to encrypt each frame of the track using derivedKey
    // This will involve processing each frame, encrypting it, and sending it.
    return { encryptedTrack }
}

const decryptTrack = async (receiver, derivedKey) => {
    const decryptedTrack = receiver.track.clone()
    // Logic to decrypt each frame of the track using derivedKey
    // This will involve receiving each frame, decrypting it, and rendering it.
    return { decryptedTrack }
}
