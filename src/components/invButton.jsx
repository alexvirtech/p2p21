import { invType } from "../utils/common"

export default function Component({invite,title,description}) {
    return (
        <div class="low:p-4 rounded-md w-1/2 low:pb-4 text-center low:border border-slate-400">
            <button
                class="bg-blue-600 hover:bg-blue-800 text-white w-full rounded py-1 text-lg mb-2 cursor-pointer"
                onClick={() => invite(invType.Secure)}
            >
                {title}
            </button>
            <div class="text-[11px] tablet:text-sm hidden tablet-wh:block">
                {description}
            </div>
        </div>
    )
}
