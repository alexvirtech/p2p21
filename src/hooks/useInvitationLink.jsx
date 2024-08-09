const useInvitationLink = (url) => {
    const parsedUrl = new URL(url) // Parse the full URL
    const params = new URLSearchParams(parsedUrl.search) // Pass only the query string to URLSearchParams
    const idj = params.get("id")
    const pkj = params.get("pk")

    return { idj, pkj }
}

export default useInvitationLink
