import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors' // Import the cors package
import documentsApi from './api/documentsApi.js' // Ensure the extension .js is included

const app = express()
const PORT = process.env.PORT || 5005

app.use(cors()) // Enable CORS for all routes
app.use(express.json())
app.use('/api/documents', documentsApi)

// Serve the Preact frontend (assuming it is built and located in the 'build' folder)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
