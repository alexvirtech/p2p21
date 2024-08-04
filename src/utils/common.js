export const defAccount = "Default"

export const testIfOpened = (input) => {
    const regex = new RegExp(`^${defAccount}(\\s+\\S.*|$)`)
    return regex.test(input)
}

export const invType = {
    Basic: "Basic",
    Advanced: "Advanced",
    Secure: "Secure",
    Join: "Join"    
}

export const invButtonItems = [
    {
        title: "Basic",
        description: "Peer-to-peer video and text chat for two participants.",
    },
    {
        title: "Advanced",
        description: "Peer-to-peer video and text chat with collaboration tools: shared tasks, screens, whiteboard, files and folders.",
    },
    {
        title: "Secure",
        description: "Peer-to-peer voice and text chat, using asymmetric encryption and providing a blockchain security level.",
    },
    {
        title: "Join",
        description: "Join a friend's ExtraSafe chat session via an invitation link."
    }
]