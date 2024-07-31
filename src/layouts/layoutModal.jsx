import { createPortal } from 'preact/compat'

export default function LayoutModal({ children, title, close = ()=>{}, width = "w-[90%] max-w-[600px]", mt="mt-[5%]"}) { 
    return createPortal( 
        <div class="fixed z-[1000] inset-0 overflow-y-auto flex items-start justify-center" onClick={(e)=>e.stopPropagation()}> 
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={close}></div>
            <div class={" rounded-md text-left overflow-hidden shadow-xl transform transition-all " + width + " " + mt}>
                <div class="bg-m-blue-light-5 dark:bg-m-gray-light-4 px-4 py-3 flex justify-between border-b border-m-blue-light-5 rounded-t-md">
                    <div class="text-xl">{title}</div>
                    <div>
                        <button
                            title="close"
                            className="p-0 m-0 text-white border-gray-300 border-0 rounded"
                            onClick={close}
                        >
                            &times;                       
                        </button>
                    </div>
                </div>
                <div class="p-0 bg-m-blue-light-2 dark:bg-m-blue-dark-2 ">{children}</div>                
            </div>
        </div>,
        document.body
    )
}


