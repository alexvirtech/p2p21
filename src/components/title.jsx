import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import MainMenu from "./mainMenu"
import AccountMenu from "./accountMenu"
import { AccountIcon, MainMenuIcon } from "../utils/icons"
import CreateAccount from "../modals/createAccount"
import AccountInfo from "../modals/accountInfo"
import DeleteAccount from "../modals/deleteAccount"
import RenameAccount from "../modals/renameAccount"
import ChangePassword from "../modals/changePassword"
import RestoreAccount from "../modals/restoreAccount"

const Title = () => {
    const { state, dispatch } = useContext(Context)
    const [showMainMenu, setShowMain] = useState(false)
    const [showAccMenu, setShowAcc] = useState(false)

    return (
        <div class="border-b border-gray-500 flex justify-between relative items-center h-16">
            <div class="py-3 px-6 cursor-pointer" onClick={() => setShowMain(true)}>
                <MainMenuIcon />
            </div>
            <h1 class="text-xl xxxs:text-3xl flex justify-center py-2 text-slate-600 font-bold gap-2">ExtraSafe <div class="hidden mobile:inline">Communicator</div></h1>
            <div class="py-2 px-6 cursor-pointer" onClick={()=>setShowAcc(true)} title={state.account?.name}>
                <AccountIcon />
            </div>
            {showMainMenu && <MainMenu close={() => setShowMain(false)} />}
            {showAccMenu && <AccountMenu close={() => setShowAcc(false)} />}
            {state.modal === 'create' && <CreateAccount close={()=>dispatch({type:'SET_MODAL',payload:null})}/>}
            {state.modal === 'info' && <AccountInfo close={()=>dispatch({type:'SET_MODAL',payload:null})}/>}
            {state.modal === 'delete' && <DeleteAccount close={()=>dispatch({type:'SET_MODAL',payload:null})}/>}
            {state.modal === 'rename' && <RenameAccount close={()=>dispatch({type:'SET_MODAL',payload:null})}/>}
            {state.modal === 'changePassword' && <ChangePassword close={()=>dispatch({type:'SET_MODAL',payload:null})}/>}
            {state.modal === 'restore' && <RestoreAccount close={()=>dispatch({type:'SET_MODAL',payload:null})}/>}           
        </div>
    )
}

export default Title
