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
        title: invType.Basic,
        description: "Peer-to-peer video and text chat for two participants.",
    },
    {
        title: invType.Advanced,
        description: "Peer-to-peer video and text chat with collaboration tools: shared tasks, screens, whiteboard, files and folders.",
    },
    {
        title: invType.Secure,
        description: "Peer-to-peer voice and text chat, using asymmetric encryption and providing a blockchain security level.",
    },
    {
        title: invType.Join,
        description: "Join a friend's ExtraSafe chat session via an invitation link."
    }
]