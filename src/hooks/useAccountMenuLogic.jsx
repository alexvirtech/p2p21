import { useState, useRef, useEffect } from "preact/hooks"

const useAccountMenuLogic = (defAccount, state, dispatch) => {
    const [selectedAccount, setSelectedAccount] = useState(state.account.name)
    const tempName = useRef(null)

    useEffect(() => {
        if(state.account.name){
            setSelectedAccount(state.account.name)    
        }
    }, [state.account.name])

    const handleAccountChange = (e) => {
        const newAccount = e.target.value
        if (newAccount === defAccount) {
            setSelectedAccount(defAccount)
            dispatch({ type: "SET_DEF_ACCOUNT"})
        } else {
            dispatch({ type: "SET_MODAL", payload: "password" })
        }
    }

    const handlePasswordSubmit = (isPasswordCorrect) => {
        if (isPasswordCorrect) {
            setSelectedAccount(tempName.current?.value)
            //dispatch({ type: "SET_ACCOUNT", payload: tempName.current?.value })
        } else {
            setSelectedAccount(defAccount)
            dispatch({ type: "SET_DEF_ACCOUNT"})
        }
        dispatch({ type: "SET_MODAL", payload: null })
    }

    const closePassword = () => {
        setSelectedAccount(defAccount)
        dispatch({ type: "SET_MODAL", payload: null })
    }

    return {
        tempName,
        selectedAccount,
        handleAccountChange,
        handlePasswordSubmit,
        closePassword,
    }
}

export default useAccountMenuLogic
