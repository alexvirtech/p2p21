const useQueryParams = () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id") 
    const tp = params.get("tp")
    const pk = params.get("pk")

    return { id, tp, pk }
}

export default useQueryParams
