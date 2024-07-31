import { createPortal } from 'preact/compat'

export default function LayoutModal({ children, title, close = ()=>{}, width = "w-[90%] max-w-[600px]", mt="mt-[5%]"}) { 
    return createPortal( 
        <div class="fixed z-[1000] inset-0 overflow-y-auto flex items-start justify-center" onClick={(e)=>e.stopPropagation()}> 
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={close}></div>
            <div class={"z-[1002] rounded-md text-left overflow-hidden shadow-xl transform transition-all " + width + " " + mt}>
                <div class="bg-slate-600 px-8 py-3 flex justify-between rounded-t-md">
                    <div class="text-xl text-white">{title}</div>
                    <div>
                        <button
                            title="close"
                            class="p-0 m-0 text-white border-gray-300 border-0 rounded text-xl"
                            onClick={close}
                        >
                            &times;                       
                        </button>
                    </div>
                </div>
                <div class="bg-white py-4 px-8">{children}</div>                
            </div>
        </div>,
        document.body
    )
}


