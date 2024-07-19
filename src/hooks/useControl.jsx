// hooks/useControl.js
import { useEffect, useState, useReducer } from "preact/hooks"
import { InitState, reducer } from "../utils/reducer"

export const useControl = () => {
    const [state, dispatch] = useReducer(reducer, InitState)
    const [isControlled, setIsControlled] = useState(true)

    useEffect(() => {
        if (state.conn) {
            state.conn.on("data", (data) => {
                if (data.type === "CONTROL") {
                    setIsControlled(data.payload === state.peer.id)
                }
            })
        }
    }, [state.conn, state.peer])

    const passControl = () => {
        if (state.conn) {
            state.conn.send({ type: "CONTROL", payload: state.conn.peer })
            setIsControlled(false)
        }
    }

    return { isControlled, passControl }
}
