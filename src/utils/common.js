export const defAccount = "Default"

export const testIfOpened = (input) => {
    const regex = new RegExp(`^${defAccount}(\\s+\\S.*|$)`)
    return regex.test(input)
}