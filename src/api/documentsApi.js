import axios from 'axios'

const API_URL = 'http://localhost:5005/api/documents' // Ensure this URL matches your server configuration

export const fetchFiles = async (folderId) => {
    const response = await axios.get(`${API_URL}/files`, { params: { folderId } })
    return response.data
}

export const createFolder = async (parentId, folderName) => {
    const response = await axios.post(`${API_URL}/createFolder`, { parentId, folderName })
    return response.data
}

export const createDocument = async (parentId, docName) => {
    const response = await axios.post(`${API_URL}/createDocument`, { parentId, docName })
    return response.data
}

export const createSheet = async (parentId, sheetName) => {
    const response = await axios.post(`${API_URL}/createSheet`, { parentId, sheetName })
    return response.data
}

export const openFile = async (fileId) => {
    const response = await axios.get(`${API_URL}/openFile`, { params: { fileId } })
    return response.data
}
