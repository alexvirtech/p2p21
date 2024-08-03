import { useState, useRef, useEffect } from "preact/hooks"
import { testIfOpened } from "../utils/common"

const useAccountMenuLogic = (defAccount, state, dispatch) => {
    const [selectedAccount, setSelectedAccount] = useState()
    const tempName = useRef(null)

    useEffect(() => {
        if(state.account?.name){
            setSelectedAccount(state.account.name)    
        }else{
            setSelectedAccount(defAccount)
        }
    }, [state.account?.name])

    const handleAccountChange = (e) => {
        const newAccount = e.target.value
        if (testIfOpened(newAccount)) {
            setSelectedAccount(newAccount)
            const acc = state.accounts.find((a) => a.name === newAccount)
            //const wallet = acc.wallet ?? decrypt(acc.encWallet, password.current.value)
            dispatch({ type: "SET_DEF_ACCOUNT", payload: newAccount.name === defAccount ? null : acc })  
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
