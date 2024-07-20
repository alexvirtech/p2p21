import { google } from "googleapis"

const auth = new google.auth.GoogleAuth({
    keyFile: "config/extrasafe-429914-a7e0a51d285a.json", // Ensure this path is correct
    scopes: ["https://www.googleapis.com/auth/drive"], // Ensure this scope is correct
})

auth.getClient().catch((error) => {
    console.error("Error getting client:", error)
})

export default auth 
