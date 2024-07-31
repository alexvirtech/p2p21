import LayoutMenu from "../layouts/layoutMenu"
import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { pages } from "../utils/pages"
import { AccountIcon, SelectedIcon } from "../utils/icons"
import { route } from "preact-router"

const AccountMenu = ({ close }) => {
    const { state, dispatch } = useContext(Context)
    
    const actions = [
        { label: "Create New Account", action: "create" },
        { label: "Account Details", action: "account" },
        { label: "Change Password", action: "password" },
        { label: "Delete Account", action: "delete" }
    ]
    
    const [menu, setMenu] = useState(actions)

    /* useEffect(() => {
        setMenu(() => updatePages())
    }, [])

    useEffect(() => {
        setMenu(() => updatePages())
    }, [state.page])

    const updatePages = () => {
        return pages.map((item) => {
            if (item.label === state.page) {
                return { ...item, selected: true }
            } else {
                return { ...item, selected: false }
            }
        })
    } */

    const handleClick = (lbl) => {
        //dispatch({ type: "SET_PAGE", payload: lbl })
        alert(`You clicked ${lbl}`) // temp
        close()
    }

    return (
        <LayoutMenu title="123" close={() => close()}>
            <div class="flex flex-col w-64 bg-gray-800 absolute right-0 top-16 z-10">
                <div class="items-center text-center border-b border-gray-700 p-4">
                    <div class="text-slate-400">Current Account</div>
                    <div class="">
                        <select class="bg-gray-600 text-white text-2xl w-full border border-slate-400 px-2 py-1 rounded text-center" onChange={(e) => route(e.target.value)}>
                            <option value="Default">Default</option>
                            <option value="Account 12">Account 12</option>
                        </select>
                    </div>
                </div>
                {menu.map((item, index) => (
                    <div class="hover:bg-gray-700" key={index} onClick={() => handleClick(item.label)}>
                        <div
                            class={`cursor-pointer flex items justify-center gap-1 items-center h-16 border-b border-gray-700 ${
                                item.selected ? "px-3" : "px-10"
                            }`}
                        >
                            {item.selected && <SelectedIcon />}
                            <div class="text-white font-semibold">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </LayoutMenu>
    )
}

export default AccountMenu
