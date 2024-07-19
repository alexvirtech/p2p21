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
            setCurrentFolder({ id: "root", name: "Root" })
            setFiles(rootFolderFiles || []) // Ensure files is an array
            setPath(["Root"])
        } catch (error) {
            console.error("Error fetching root folder:", error)
        }
    }

    const openFolder = async (folderId) => {
        try {
            const folderFiles = await fetchFiles(folderId)
            setCurrentFolder({ id: folderId, name: folderFiles.name })
            setFiles(folderFiles || []) // Ensure files is an array
            setPath((prevPath) => [...prevPath, folderFiles.name])
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
            } catch (error) {
                console.error("Error creating sheet:", error)
            }
        }
    }

    const handleOpenFile = async (fileId) => {
        try {
            const file = await openFile(fileId)
            setSelectedFile(file)
            setView("document")
        } catch (error) {
            console.error("Error opening file:", error)
        }
    }

    const handleBackToExplorer = () => {
        setView("explorer")
        setSelectedFile(null)
        setPath((prevPath) => prevPath.slice(0, -1))
    }

    return (
        <div className="documents-panel">
            {view === "explorer" && (
                <div className="explorer-view">
                    <div className="top-bar">
                        <button onClick={handleCreateFolder}>New Folder</button>
                        <button onClick={handleCreateDocument}>New Document</button>
                        <button onClick={handleCreateSheet}>New Sheet</button>
                    </div>
                    <div className="files-list">
                        {Array.isArray(files) && files.length > 0 ? (
                            files.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() =>
                                        file.mimeType === "application/vnd.google-apps.folder"
                                            ? openFolder(file.id)
                                            : handleOpenFile(file.id)
                                    }
                                >
                                    {file.name}
                                </div>
                            ))
                        ) : (
                            <div>No files or folders</div>
                        )}
                    </div>
                </div>
            )}
            {view === "document" && selectedFile && (
                <div className="document-view">
                    <div className="top-bar">
                        <span>{path.join(" / ")}</span>
                        <button onClick={handleBackToExplorer}>Back to Explorer</button>
                    </div>
                    <iframe src={selectedFile.url} style={{ width: "100%", height: "calc(100% - 50px)" }} />
                </div>
            )}
        </div>
    )
}

export default Documents
