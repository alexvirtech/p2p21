import { invType } from "../utils/common"

export default function InvButton({invite,title,description}) {
    return (
        <div class="p-2 landscape:h700:p-4 rounded-md w-1/2 text-center max-w-[200px]"> {/* landscape:h700:border border-slate-400 */}
            <button
                class="bg-blue-600 hover:bg-blue-800 text-white w-full rounded py-1 text-lg mb-2 cursor-pointer"
                onClick={() => invite(title)}
            >
                {title}
            </button>
            <div class="text-[11px] tablet:text-sm hidden landscape:h700:block">
                {description}
            </div>
        </div>
    )
}
