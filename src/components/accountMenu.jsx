import LayoutMenu from "../layouts/layoutMenu"
import { useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { SelectedIcon } from "../utils/icons"
import { actions } from "../utils/menus"
import { defAccount, testIfOpened } from "../utils/common"
import Password from "../modals/password"
import useAccountMenuLogic from "../hooks/useAccountMenuLogic"

const AccountMenu = ({ close }) => {
    const { state, dispatch } = useContext(Context)
    const { tempName, selectedAccount, handleAccountChange, handlePasswordSubmit, closePassword } = useAccountMenuLogic(
        defAccount,
        state,
        dispatch,
    )

    const handleClick = (item) => {
        if (item.func) {
            item.func(state.account.name)
        } else {
            dispatch({ type: "SET_MODAL", payload: item.action })
        }
        close()
    }

    const changeAccount = (e) => {
        handleAccountChange(e)
        //close()
    }

    return (
        <LayoutMenu close={close}>
            <div class="overflow-y-scroll no-scrollbar max-h-[100vh] right-0 top-0 z-10 bottom-0 absolute bg-gray-800 ">
                <div class="flex flex-col w-64 h-full">
                    <div class="flex items-center justify-between h-16 border-b border-gray-700 px-4">
                        <div class="text-white font-bold text-2xl">Account</div>
                        <div class="text-white font-semibold cursor-pointer text-3xl" onClick={close}>
                            &times;
                        </div>
                    </div>
                    <div class="items-center text-center border-b border-gray-700 p-4">
                        <div class="text-slate-400">Current Account</div>
                        <div>
                            <select
                                class="bg-gray-600 text-white text-2xl w-full border border-slate-400 px-2 py-1 rounded text-center"
                                onChange={changeAccount}
                                ref={tempName}
                                value={selectedAccount}
                            >
                                {state.accounts.map((a, i) => (
                                    <option key={i} value={a.name}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {actions.map((item, index) => (
                        <>
                            {(!testIfOpened(selectedAccount) ||
                                item.custom ||
                                (item.action === "delete" && selectedAccount !== defAccount)) && (
                                <div class="hover:bg-gray-700" key={index} onClick={() => handleClick(item)}>
                                    <div
                                        class={`cursor-pointer flex justify-center gap-1 items-center h-16 border-b border-gray-700 ${
                                            item.selected ? "px-3" : "px-10"
                                        } ${item.border ? "border-b-4" : "border-b"}`}
                                    >
                                        {item.selected && <SelectedIcon />}
                                        <div class="text-white font-semibold">{item.label}</div>
                                    </div>
                                </div>
                            )}
                        </>
                    ))}
                </div>
            </div>
            {state.modal === "password" && (
                <Password
                    name={tempName.current?.value}
                    title="Enter Password"
                    close={closePassword}
                    onSubmit={handlePasswordSubmit}
                />
            )}
        </LayoutMenu>
    )
}

export default AccountMenu
