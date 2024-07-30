import { useEffect, useContext, useRef } from "preact/hooks"
import { Context } from "../utils/context"

export default function Templates() {
    const { state, dispatch } = useContext(Context)

    return (
        <div class="flex justify-start gap-4">
            <div class="flex flex-col gap-1 h-[210px] w-[210px] border border-slate-400 hover:border-red-600 rounded bg-white cursor-pointer" title="Use empty template" onClick={()=>dispatch({type:'SET_TEMPLATE',payload:'empty'})}>
                <div class="font-bold text-center">Empty layout</div>
                <div class="w-[180px] h-[60px] mx-auto rounded bg-slate-300 p-4 flex justify-center items-center">
                    image
                </div>
                <div class="grow text-sm text-center px-2">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam dicta voluptas vel quia accusantium explicabo maiores.
                </div>               
            </div>

            <div class="flex flex-col gap-1 h-[210px] w-[210px] border border-slate-400 rounded  hover:border-red-600 bg-white cursor-pointer" title="Use Braude project template"  onClick={()=>dispatch({type:'SET_TEMPLATE',payload:'braude'})}>
                <div class="font-bold text-center">Braude project</div>
                <div class="w-[180px] h-[60px] mx-auto rounded bg-slate-300 p-4 flex justify-center items-center">
                    image
                </div>
                <div class="grow text-sm text-center px-2">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam dicta voluptas vel quia accusantium explicabo maiores.
                </div>               
            </div>

        </div>
    )
}