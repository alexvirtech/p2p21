import CryptoJS from "crypto-js"

export const encrypt = (text, password) => {
    return CryptoJS.AES.encrypt(text, password).toString()
}

export const decrypt = (text, password) => {
    try {
        return CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8)
    } catch (e) {
        return null
    }
} 
