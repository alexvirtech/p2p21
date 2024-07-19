import { Router } from 'express'
import { google } from 'googleapis'
import { auth } from '../googleAuth.js'

const router = Router()
const drive = google.drive({ version: 'v3', auth: await auth.getClient() })

const ROOT_FOLDER_ID = 'https://drive.google.com/drive/folders/12A9SujImS-Xby8MHzyWTEE-7MvgH7EpF?usp=drive_link' // Replace with your root folder ID

router.get('/files', async (req, res) => {
    const { folderId } = req.query
    const parentId = folderId || ROOT_FOLDER_ID
    const response = await drive.files.list({
        q: `'${parentId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
    })
    res.json(response.data.files)
})

router.post('/createFolder', async (req, res) => {
    const { parentId, folderName } = req.body
    const actualParentId = parentId || ROOT_FOLDER_ID
    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [actualParentId],
    }
    const response = await drive.files.create({
        resource: fileMetadata,
        fields: 'id, name',
    })
    res.json(response.data)
})

router.post('/createDocument', async (req, res) => {
    const { parentId, docName } = req.body
    const actualParentId = parentId || ROOT_FOLDER_ID
    const fileMetadata = {
        name: docName,
        mimeType: 'application/vnd.google-apps.document',
        parents: [actualParentId],
    }
    const response = await drive.files.create({
        resource: fileMetadata,
        fields: 'id, name, webViewLink',
    })
    res.json(response.data)
})

router.post('/createSheet', async (req, res) => {
    const { parentId, sheetName } = req.body
    const actualParentId = parentId || ROOT_FOLDER_ID
    const fileMetadata = {
        name: sheetName,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [actualParentId],
    }
    const response = await drive.files.create({
        resource: fileMetadata,
        fields: 'id, name, webViewLink',
    })
    res.json(response.data)
})

router.get('/openFile', async (req, res) => {
    const { fileId } = req.query
    const response = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink',
    })
    res.json({ id: fileId, url: response.data.webViewLink })
})

router.get('/test', (req, res) => {
    res.send('API is working!')
})

export default router