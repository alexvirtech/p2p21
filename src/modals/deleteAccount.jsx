import LayoutModal from '../layouts/layoutModal'

export default function DeleteAccount({close}) {
    const handleSubmit = (e) => {
        e.preventDefault()
        //close()
    }

    return (
        <LayoutModal title="Delete Account" close={close}>
            <form onSubmit={handleSubmit}>
                <div>Account name</div>
                <div><input class="w-full border border-slate-400 rounded py-1.5 px-4" required/></div>
                <div class="pt-3">Password</div>
                <div><input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required/></div>
                <div class="pt-3">Confirm password</div>
                <div><input class="w-full border border-slate-400 rounded py-1.5 px-4" type="password" required/></div>
                <div class="pt-2">
                    <button class="bg-blue-500 text-lg text-white rounded py-1.5 px-8 my-4" type="submit">Create</button>
                </div>
            </form>
        </LayoutModal>

    )
}