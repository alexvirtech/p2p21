export const defAccount = "Default"

export const testIfOpened = (input) => {
    const regex = new RegExp(`^${defAccount}(\\s+\\S.*|$)`)
    return regex.test(input)
}

export const invType = {
    Basic: "Basic",
    Advanced: "Advanced",
    Secure: "Secure",
    Join: "Join",
}

