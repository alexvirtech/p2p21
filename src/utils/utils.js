export const downloadJSON = (jsonObject, filename = "data.json") => {
    // Convert JSON object to string
    const jsonString = JSON.stringify(jsonObject, null, 2)

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" })

    // Create a link element
    const link = document.createElement("a")

    // Set the download attribute with the filename
    link.download = filename

    // Create a URL for the Blob and set it as the href attribute
    link.href = URL.createObjectURL(blob)

    // Append the link to the document
    document.body.appendChild(link)

    // Programmatically click the link to trigger the download
    link.click()

    // Remove the link from the document
    document.body.removeChild(link)
}

/* // Example usage:
const data = { name: "John Doe", age: 30, city: "New York" };
downloadJSON(data, 'example.json'); */

export const capitalize = (str) => {
    if (typeof str !== "string" || str.length === 0) return ""
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const shareText = async (textToShare) => {
    if (!navigator.share) {
        console.error("Web Share API is not supported in your browser")
        return
    }
    try {
        await navigator.share({
            text: textToShare,
        })
        console.log("Address shared successfully")
    } catch (err) {
        console.error("Failed to share address: ", err)
    }
}

export const shareLink = async (title, url) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: `${title} - ${url}`,
                url: url,
            })
            console.log("Link shared successfully")
        } catch (error) {
            console.error("Error sharing link:", error)
        }
    } else {
        console.warn("Web Share API is not supported in this browser")
    }
}
