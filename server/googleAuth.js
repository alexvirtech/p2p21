import { google } from "googleapis"

const auth = new google.auth.GoogleAuth({
    keyFile: "config/extrasafe-429914-032ac06e7584.json", // Ensure the path is correct
    scopes: ["https://www.googleapis.com/auth/drive"],
})

export { auth } // Ensure this line correctly exports the auth object
