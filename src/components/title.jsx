import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import MainMenu from "./mainMenu"
import AccountMenu from "./accountMenu"
import { AccountIcon, MainMenuIcon } from "../utils/icons"

const Title = () => {
    const [showMainMenu, setShowMain] = useState(false)
    const [showAccMenu, setShowAcc] = useState(false)

    return (
        <div class="border-b border-gray-500 flex justify-between relative items-center h-16">
            <div class="py-3 px-6" onClick={() => setShowMain(true)}>
                <MainMenuIcon />
            </div>
            <h1 class="text-3xl flex justify-center py-2 text-slate-600 font-bold">ExtraSafe Communicator</h1>
            <div class="py-2 px-6" onClick={()=>setShowAcc(true)}>
                <AccountIcon />
            </div>
            {showMainMenu && <MainMenu close={() => setShowMain(false)} />}
            {showAccMenu && <AccountMenu close={() => setShowAcc(false)} />}
        </div>
    )
}

export default Title
