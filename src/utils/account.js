import {ethers} from 'ethers'

export const createAccount = () => {    
    const wallet = ethers.Wallet.createRandom()
    return wallet
}