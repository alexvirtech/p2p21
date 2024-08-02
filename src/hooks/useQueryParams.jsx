const useQueryParams = () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    const tp = params.get("tp")

    return { id, tp }
}

export default useQueryParams
