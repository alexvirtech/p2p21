import { useState, useEffect, useContext } from "preact/hooks"
import { fetchFiles, createFolder, createDocument, createSheet, openFile } from "../api/documentsApi"
import { Context } from "../utils/context"

const Documents = () => {
    const { state } = useContext(Context)
    const [view, setView] = useState("explorer")
    const [currentFolder, setCurrentFolder] = useState(null)
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [path, setPath] = useState([])

    useEffect(() => {
        if (state.peer) {
            fetchRootFolder()
        }
    }, [state.peer])

    const fetchRootFolder = async () => {
        try {
            const rootFolderFiles = await fetchFiles() // No folderId means root folder
            setCurrentFolder({ id: 'root', name: 'Root' })
            setFiles(rootFolderFiles || []) // Ensure files is an array
            setPath(['Root'])
        } catch (error) {
            console.error("Error fetching root folder:", error)
        }
    }

    const openFolder = async (folderId, remote = false) => {
        try {
            const folderFiles = await fetchFiles(folderId)
            setCurrentFolder({ id: folderId, name: folderFiles.name })
            setFiles(folderFiles || []) // Ensure files is an array
            setPath((prevPath) => [...prevPath, folderFiles.name])
            if (!remote && state.conn) {
                state.conn.send(JSON.stringify({ type: 'openFolder', folderId }))
            }
        } catch (error) {
            console.error("Error opening folder:", error)
        }
    }

    const handleCreateFolder = async () => {
        if (!currentFolder) return
        const folderName = prompt("Enter folder name:")
        if (folderName) {
            try {
                const newFolder = await createFolder(currentFolder.id, folderName)
                setFiles((prevFiles) => [...prevFiles, newFolder])
                if (state.conn) {
                    state.conn.send(JSON.stringify({ type: 'createFolder', folder: newFolder }))
                }
            } catch (error) {
                console.error("Error creating folder:", error)
            }
        }
    }

    const handleCreateDocument = async () => {
        if (!currentFolder) return
        const docName = prompt("Enter document name:")
        if (docName) {
            try {
                const newDoc = await createDocument(currentFolder.id, docName)
                setFiles((prevFiles) => [...prevFiles, newDoc])
                if (state.conn) {
                    state.conn.send(JSON.stringify({ type: 'createDocument', document: newDoc }))
                }
            } catch (error) {
                console.error("Error creating document:", error)
            }
        }
    }

    const handleCreateSheet = async () => {
        if (!currentFolder) return
        const sheetName = prompt("Enter sheet name:")
        if (sheetName) {
            try {
                const newSheet = await createSheet(currentFolder.id, sheetName)
                setFiles((prevFiles) => [...prevFiles, newSheet])
                if (state.conn) {
                    state.conn.send(JSON.stringify({ type: 'createSheet', sheet: newSheet }))
                }
            } catch (error) {
                console.error("Error creating sheet:", error)
            }
        }
    }

    const handleOpenFile = async (fileId, remote = false) => {
        try {
            const file = await openFile(fileId)
            setSelectedFile(file)
            setView("document")
            if (!remote && state.conn) {
                state.conn.send(JSON.stringify({ type: 'openFile', fileId }))
            }
        } catch (error) {
            console.error("Error opening file:", error)
        }
    }

    const handleBackToExplorer = (remote = false) => {
        setView("explorer")
        setSelectedFile(null)
        setPath((prevPath) => prevPath.slice(0, -1))
        if (!remote && state.conn) {
            state.conn.send(JSON.stringify({ type: 'backToExplorer' }))
        }
    }

    // Listen for messages from the other peer
    useEffect(() => {
        if (state.conn) {
            state.conn.on('data', (data) => {
                const message = JSON.parse(data)
                if (message.type === 'openFolder') {
                    openFolder(message.folderId, true)
                } else if (message.type === 'openFile') {
                    handleOpenFile(message.fileId, true)
                } else if (message.type === 'backToExplorer') {
                    handleBackToExplorer(true)
                } else if (message.type === 'createFolder') {
                    setFiles((prevFiles) => [...prevFiles, message.folder])
                } else if (message.type === 'createDocument') {
                    setFiles((prevFiles) => [...prevFiles, message.document])
                } else if (message.type === 'createSheet') {
                    setFiles((prevFiles) => [...prevFiles, message.sheet])
                }
            })
        }
    }, [state.conn])

    const renderFileIcon = (mimeType) => {
        switch (mimeType) {
            case 'application/vnd.google-apps.folder':
                return (
                    <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l1-2a2 2 0 012-2h3l2 2h6a2 2 0 012 2v2m-2 10a2 2 0 002-2V7a2 2 0 00-2-2h-6l-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-4H3v4a2 2 0 002 2h14z"></path>
                    </svg>
                )
            case 'application/vnd.google-apps.document':
                return (
                    <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h9l7 7v9a2 2 0 01-2 2z"></path>
                    </svg>
                )
            case 'application/vnd.google-apps.spreadsheet':
                return (
                    <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-8h6m2 12H7a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v9a2 2 0 01-2 2z"></path>
                    </svg>
                )
            default:
                return (
                    <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v2m0-6v2m0 4h.01M12 5h.01M17 16H7a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2z"></path>
                    </svg>
                )
        }
    }

    const renderFileTree = (files) => {
        return files.map((file) => (
            <div key={file.id} onClick={() => file.mimeType === 'application/vnd.google-apps.folder' ? openFolder(file.id) : handleOpenFile(file.id)} className="cursor-pointer p-2 hover:bg-gray-200 flex items-center">
                {renderFileIcon(file.mimeType)} {file.name}
            </div>
        ))
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {view === "explorer" && (
                <div className="flex flex-col h-full">
                    <div className="h-12 flex items-center justify-between p-2 bg-gray-100">
                        <button onClick={handleCreateFolder} className="btn btn-primary">New Folder</button>
                        <button onClick={handleCreateDocument} className="btn btn-primary">New Document</button>
                        <button onClick={handleCreateSheet} className="btn btn-primary">New Sheet</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {Array.isArray(files) && files.length > 0 ? (
                            <div className="file-tree">
                                {renderFileTree(files)}
                            </div>
                        ) : (
                            <div>No files or folders</div>
                        )}
                    </div>
                </div>
            )}
            {view === "document" && selectedFile && (
                <div className="flex flex-col h-full">
                    <div className="h-12 flex items-center justify-between p-2 bg-gray-100">
                        <span>{path.join(" / ")}</span>
                        <button onClick={() => handleBackToExplorer()} className="btn btn-secondary">Back to Explorer</button>
                    </div>
                    <div className="flex-1 flex">
                        <iframe src={selectedFile.url} className="w-full h-full border-none flex-1" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Documents
