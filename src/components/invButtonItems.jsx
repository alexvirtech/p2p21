import { invType } from "../utils/common"

const InvButtonItems = ({title}) => {
    const items = [
        {
            title: invType.Basic,
            description: (
                <>
                    <span>Invitation link for</span>&nbsp;<b class="text-slate-500">peer-to-peer</b> video and text chat for two participants.
                </>
            ),
        },
        {
            title: invType.Advanced,
            description: (
                <>
                    <span>Invitation link for</span>&nbsp;<b class="text-slate-500">peer-to-peer</b> video and text chat with collaboration tools: shared tasks, screens, whiteboard, files and
                    folders.
                </>
            ),
        },
        {
            title: invType.Secure,
            description: (
                <>
                    <span>Invitation link for</span>&nbsp;<b class="text-slate-500">peer-to-peer</b> video and text chat, using <b class="text-slate-500">asymmetric encryption</b> and providing a <b class="text-slate-500">blockchain privacy and security level</b>.
                </>
            ),
        },
        {
            title: invType.Join,
            description: <>Join a friend's ExtraSafe chat session by an invitation link.</>,
        },
    ]    
    return items.find((item) => item.title === title)?.description
}

export default InvButtonItems