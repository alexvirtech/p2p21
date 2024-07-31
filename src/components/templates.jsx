import { useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"

export default function Templates() {
    const { state, dispatch } = useContext(Context)

    return (
        <div class="flex justify-start gap-3">
            <div class="h-[210px] w-[210px] border-4 border-transparent hover:border-red-600 rounded bg-white cursor-pointer" title="Use empty template" onClick={()=>dispatch({type:'SET_TEMPLATE',payload:'empty'})}>
                <div class="h-full flex flex-col gap-1 border border-slate-400 rounded hover:border-transparent">
                    <div class="font-bold text-center">Empty layout</div>
                    <div class="w-[180px] h-[60px] mx-auto rounded bg-slate-300 p-4 flex justify-center items-center">
                        image
                    </div>
                    <div class="grow text-sm text-center px-2">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam dicta voluptas vel quia accusantium explicabo maiores.
                    </div>
                </div>               
            </div>

            <div class="h-[210px] w-[210px] border-4 border-transparent rounded  hover:border-red-600 bg-white cursor-pointer" title="Use Braude project template"  onClick={()=>dispatch({type:'SET_TEMPLATE',payload:'braude'})}>
            <div class="h-full flex flex-col gap-1 border border-slate-400 rounded hover:border-transparent">
                    <div class="font-bold text-center">Braude</div>
                    <div class="w-[180px] h-[60px] mx-auto rounded bg-slate-300 p-4 flex justify-center items-center">
                        image
                    </div>
                    <div class="grow text-sm text-center px-2">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam dicta voluptas vel quia accusantium explicabo maiores.
                    </div>    
               </div>           
            </div>

        </div>
    )
}