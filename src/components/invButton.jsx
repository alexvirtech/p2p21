import { useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { invType } from "../utils/common"
import InvButtonItems from "./invButtonItems"

export default function InvButton({title}) {
const { state, dispatch } = useContext(Context)

    const invite = () => {        
        //setType(type)
        if(title === invType.Join){ // Join
            // 
        }else{ // Secure, Basic, Advanced
            dispatch({ type: "SET_MODAL", payload: "invitation", mode:title })
        }
        
    }

    return (
        <div class="p-2 landscape:h700:p-4 rounded-md w-1/2 text-center max-w-[300px] landscape:h700:border border-slate-300 m-1"> 
            <button
                class="bg-blue-600 hover:bg-blue-800 text-white w-full rounded py-1 text-lg mb-2 cursor-pointer"
                onClick={invite}
            >
                {title}
            </button>
            <div class="text-[11px] tablet:text-sm hidden landscape:h700:block">
                <InvButtonItems title={title} />
            </div>
        </div>
    )
}
