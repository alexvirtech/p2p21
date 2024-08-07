import { Context } from "../utils/context"
import Title from "../components/title"
import CallerWithVideo from "../components/callerWithVideo"
import Chat from "../components/chat"
import Status from "../components/status"

const Layout = ({ state, dispatch, children }) => {
    return (
        <Context.Provider value={{ state, dispatch }}>
            <div class="h-screen flex flex-col">
                <Title />
                <div class="grow flex justify-center gap-0 py-4">
                    {children}                   
                </div>

                <Status />
            </div>
        </Context.Provider>
    )
}

export default Layout
