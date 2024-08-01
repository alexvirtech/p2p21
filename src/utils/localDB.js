import { defAccount } from "./common"
import { createAccount } from "./account"
import { encrypt, decrypt } from "./crypto"
import { downloadJSON } from "./utils"

export const ifAccountExists = (name) => {
    const acc = JSON.parse(localStorage.getItem("accounts"))
    const ex = acc.find((a) => a.name === name) ? true : false
    return ex
}

export const getAccounts = () => {
    //localStorage.removeItem("accounts")
    const acc = localStorage.getItem("accounts")
    if (!acc) {
        // crate default account
        const { publicKey, privateKey, mnemonic } = createAccount()
        const a = {
            name: defAccount,
            wallet: { publicKey, privateKey, mnemonic: mnemonic.phrase },
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

export const deleteAccountByName = (name, password) => {
    if (name === defAccount) return "Default account cannot be deleted"
    const acc = getAccounts()
    const del = acc.find((a) => a.name === name)
    const wallet = decrypt(del.encWallet, password)
    if (!wallet) return "Wrong password"
    const updatedAcc = acc.filter((a) => a.name !== name)
    localStorage.setItem("accounts", JSON.stringify(updatedAcc))
    return null
}

export const renameAccount = (name, newName, password) => {
    if (name === defAccount) return "Default account cannot be renamed"
    const acc = getAccounts()
    const ren = acc.find((a) => a.name === name)
    const wallet = decrypt(ren.encWallet, password)
    if (!wallet) return "Wrong password"

    const updatedAcc = acc.map((a) => {
        return a.name === name ? { ...a, name: newName } : a
    })
    localStorage.setItem("accounts", JSON.stringify(updatedAcc))
    return null
}

export const changeAccountPassword = (name, newPassword, password) => {
    if (name === defAccount) return "Default account has not password"
    const acc = getAccounts()
    const ren = acc.find((a) => a.name === name)
    const wallet = decrypt(ren.encWallet, password)
    if (!wallet) return "Wrong password"

    const { publicKey, privateKey, mnemonic } = wallet
    const updatedAcc = acc.map((a) => {
        return a.name === name
            ? { ...a, encWallet: encrypt(JSON.stringify({ publicKey, privateKey, mnemonic }), newPassword) }
            : a
    })
    localStorage.setItem("accounts", JSON.stringify(updatedAcc))
    return null
}

export const getAccountBackup = (name) => {
    const acc = JSON.parse(localStorage.getItem("accounts"))
    const ex = acc.find((a) => a.name === name)
    downloadJSON(ex, `account_${name}.json`)
}

export const restoreAccount = (data,password) => {
    try {
        const acc = JSON.parse(data)
        const name = acc.name
        if(name===defAccount) return "Default name exists, change the name in json and try again."
        const accounts = JSON.parse(localStorage.getItem("accounts"))
        const ex = accounts.find((a) => a.name === name)
        if (ex) return "This name exists, change the name in json and try again."
        const wallet = decrypt(acc.encWallet, password)
        if(!wallet) return "Wrong password"
        accounts.push(acc)
        localStorage.setItem("accounts", JSON.stringify(accounts))
        return ""
    } catch (e) {
        return "Invalid input"
    }
}
