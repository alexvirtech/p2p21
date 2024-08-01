import { defAccount } from "./common"
import { createAccount } from "./account"
import { encrypt, decrypt } from "./crypto"

export const ifAccountExists = (name) => {
    const acc = JSON.parse(localStorage.getItem("accounts"))
    const ex = acc.find((a) => a.name === name) ? true : false
    return ex
}

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

export const deleteAccountByName = (name,password) => {
    if(name===defAccount) return 'Default account cannot be deleted'
    const acc = getAccounts()    
    const del = acc.find((a) => a.name === name)
    const wallet = decrypt(del.encWallet, password)
    if(!wallet) return 'Wrong password'    
    const updatedAcc = acc.filter((a) => a.name !== name)
    localStorage.setItem("accounts", JSON.stringify(updatedAcc))
    return null
}

export const renameAccount = (name,newName,password) => {
    if(name===defAccount) return 'Default account cannot be deleted'
    const acc = getAccounts()    
    const ren = acc.find((a) => a.name === name)
    const wallet = decrypt(ren.encWallet, password)
    if(!wallet) return 'Wrong password'    

    const updatedAcc = acc.map((a) => {
        return a.name === name ? {...a, name: newName} : a        
    })
    localStorage.setItem("accounts", JSON.stringify(updatedAcc))
    return null
}