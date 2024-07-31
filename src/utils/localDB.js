import { defAccount } from "./common"
import { createAccount } from "./account"

export const getAccounts = () =>{
    //localStorage.removeItem("accounts")
    const acc = localStorage.getItem("accounts")
    if(!acc){
        // crate default account
        const { publicKey, privateKey, mnemonic } = createAccount()
        const a = {
            name: defAccount,
            wallet: { publicKey, privateKey, mnemonic: mnemonic.phrase }           
        }
        localStorage.setItem("accounts", JSON.stringify([a]))
    }

    return JSON.parse(localStorage.getItem("accounts"))
}

export const addAccount = (account) => {
    const acc = getAccounts()
    acc.push(account)
    localStorage.setItem("accounts", JSON.stringify(acc))
}