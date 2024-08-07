import LayoutMenu from "../layouts/layoutMenu"
import { useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { SelectedIcon } from "../utils/icons"
import { connectActions } from "../utils/menus"
import { defAccount, testIfOpened, invType } from "../utils/common"
import Password from "../modals/password"

const ConnectMenu = ({ close }) => {
    const { state, dispatch } = useContext(Context)

    const invite = (type) => {               
        if(type === invType.Join){ // Join
            // 
        }else{ // Secure, Basic, Advanced
            dispatch({ type: "SET_MODAL", payload: "invitation", mode:type })
        }
        close()
        
    }

    return (
        <LayoutMenu title="123" close={close}>
            <div class="flex flex-col w-64 bg-gray-800 absolute left-1/2 bottom-[48px] z-10">
                {connectActions.map((item, index) => (
                    <>
                        <div class="hover:bg-gray-700" key={index} onClick={() => invite(item.action)}>
                            <div class="cursor-pointer flex justify-center gap-1 items-center h-16 border-b border-gray-700 px-3">
                                <div class="text-white font-semibold">{item.label}</div>
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </LayoutMenu>
    )
}

export default ConnectMenu
