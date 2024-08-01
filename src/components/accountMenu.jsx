import LayoutMenu from "../layouts/layoutMenu"
import { useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { SelectedIcon } from "../utils/icons"
import { actions } from "../utils/menus"
import { defAccount } from "../utils/common"
import Password from "../modals/password"
import useAccountMenuLogic from "../hooks/useAccountMenuLogic"

const AccountMenu = ({ close }) => {
    const { state, dispatch } = useContext(Context)
    const { tempName, selectedAccount, handleAccountChange, handlePasswordSubmit, closePassword } = useAccountMenuLogic(
        defAccount,
        state,
        dispatch,
    )

    const handleClick = (action) => {
        dispatch({ type: "SET_MODAL", payload: action })
        close()
    }

    return (
        <LayoutMenu title="123" close={close}>
            <div class="flex flex-col w-64 bg-gray-800 absolute right-0 top-16 z-10">
                <div class="items-center text-center border-b border-gray-700 p-4">
                    <div class="text-slate-400">Current Account</div>
                    <div>
                        <select
                            class="bg-gray-600 text-white text-2xl w-full border border-slate-400 px-2 py-1 rounded text-center"
                            onChange={handleAccountChange}
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
                        {(selectedAccount !== defAccount || item.custom) && (
                            <div class="hover:bg-gray-700" key={index} onClick={() => handleClick(item.action)}>
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
