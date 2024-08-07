import LayoutMenu from "../layouts/layoutMenu"
import { useState, useEffect, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { pages } from "../utils/menus"
import { SelectedIcon } from "../utils/icons"
import { route } from "preact-router"

const MainMenu = ({ close }) => {
    const { state, dispatch } = useContext(Context)
    const [menu, setMenu] = useState(pages)

    useEffect(() => {        
        setMenu(()=>updatePages())
    }, [])

    useEffect(() => {
        setMenu(()=>updatePages())
    }, [state.page])

    const updatePages = () => {
        return pages.map((item) => {
            if (item.label === state.page) {
                return { ...item, selected: true }
            } else {
                return { ...item, selected: false }
            }
        })
    }

    const handleClick = (lbl) => {
        dispatch({ type: "SET_PAGE", payload: lbl })        
        close()
    }

    return (
        <LayoutMenu close={() => close()}>
            <div class="overflow-y-scroll no-scrollbar max-h-[100vh] left-0 top-0 z-10 bottom-0 absolute bg-gray-800">
                <div class="flex flex-col w-64 h-full">
                    <div class="flex items-center justify-between h-16 border-b border-gray-700 px-4">
                        <div class="text-white font-bold text-2xl">Communicator</div>
                        <div class="text-white font-semibold cursor-pointer text-3xl" onClick={close}>
                            &times;
                        </div>
                    </div>
                    {menu.map((item, index) => (
                        <div class="hover:bg-gray-700" key={index} onClick={() => handleClick(item.label)}>
                            <div
                                class={`cursor-pointer flex items justify-start gap-1 items-center h-16 border-gray-700 ${
                                    item.selected ? "px-4" : "px-10"} ${item.border ? 'border-b-4' : 'border-b'}`}
                            >
                                {item.selected && (
                                    <SelectedIcon />
                                )}
                                <div class="text-white font-semibold">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
           </div>
        </LayoutMenu>
    )
}

export default MainMenu