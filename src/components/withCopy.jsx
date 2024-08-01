import { useState } from "preact/hooks"

function WithCopy({ children, tooltipText = "Copied to clipboard!" }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.preventDefault()
        const inputElement = e.currentTarget.parentNode.querySelector("input") ?? e.currentTarget.parentNode.querySelector("textarea")
        const inputValue = inputElement ? inputElement.value : ""

        if (inputValue) {
            navigator.clipboard
                .writeText(inputValue)
                .then(() => {
                    setCopied(true)
                    setTimeout(() => {
                        setCopied(false)
                    }, 2000)
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err)
                })
        }
    }

    return (
        <div class="relative w-full">
            {children}
            <button
                onClick={handleCopy}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 1,
                }}
                aria-label="Copy to clipboard"
                tabindex="0" // Ensures the button can receive focus
            />
            {copied && (
                <div class="absolute top-0 right-0 -mt-7 mr-1 bg-gray-700 text-white text-xs rounded py-1 px-2">{tooltipText}</div>
            )}
        </div>
    )
}

export default WithCopy
