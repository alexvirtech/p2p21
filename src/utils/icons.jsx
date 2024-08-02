export const MainMenuIcon = ({ size = 24, color = "currentColor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 fill-current text-blue-500 hover:text-blue-700 cursor-pointer"
            viewBox="0 0 448 512"
        >
            <path d="M16 132h416c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H16C7.2 60 0 67.2 0 76v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16z" />
        </svg>
    )
}

export const AccountIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 fill-current text-blue-500 hover:text-blue-700 cursor-pointer"
            viewBox="0 0 448 512"
        >
            <path d="M383.9 308.3l23.9-62.6c4-10.5-3.7-21.7-15-21.7h-58.5c11-18.9 17.8-40.6 17.8-64v-.3c39.2-7.8 64-19.1 64-31.7 0-13.3-27.3-25.1-70.1-33-9.2-32.8-27-65.8-40.6-82.8-9.5-11.9-25.9-15.6-39.5-8.8l-27.6 13.8c-9 4.5-19.6 4.5-28.6 0L182.1 3.4c-13.6-6.8-30-3.1-39.5 8.8-13.5 17-31.4 50-40.6 82.8-42.7 7.9-70 19.7-70 33 0 12.6 24.8 23.9 64 31.7v.3c0 23.4 6.8 45.1 17.8 64H56.3c-11.5 0-19.2 11.7-14.7 22.3l25.8 60.2C27.3 329.8 0 372.7 0 422.4v44.8C0 491.9 20.1 512 44.8 512h358.4c24.7 0 44.8-20.1 44.8-44.8v-44.8c0-48.4-25.8-90.4-64.1-114.1zM176 480l-41.6-192 49.6 32 24 40-32 120zm96 0l-32-120 24-40 49.6-32L272 480zm41.7-298.5c-3.9 11.9-7 24.6-16.5 33.4-10.1 9.3-48 22.4-64-25-2.8-8.4-15.4-8.4-18.3 0-17 50.2-56 32.4-64 25-9.5-8.8-12.7-21.5-16.5-33.4-.8-2.5-6.3-5.7-6.3-5.8v-10.8c28.3 3.6 61 5.8 96 5.8s67.7-2.1 96-5.8v10.8c-.1 .1-5.6 3.2-6.4 5.8z" />
        </svg>
    )
}

export const SelectedIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 512 512">
            <path
                fill="#ffffff"
                d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"
            />
        </svg>
    )
}

export const ConnectIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
            <path
                fill="#ffffff"
                d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1 .6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"
            />
        </svg>
    )
}

export const DisconnectIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="25" viewBox="0 0 640 512">
            <path
                fill="#ffffff"
                d="M268.2 381.4l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48c-10.7 4.6-16.5 16.1-13.9 27.5l24 104c2.5 10.8 12.1 18.6 23.4 18.6 100.7 0 193.7-32.4 269.7-86.9l-80-61.8c-10.9 6.5-22.1 12.7-33.6 18.1zm365.6 76.7L475.1 335.5C537.9 256.4 576 156.9 576 48c0-11.2-7.7-20.9-18.6-23.4l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-12.2 26.1-27.9 50.3-46 72.8L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3z"
            />
        </svg>
    )
}

export const SendMessageIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
            <path
                fill="#ffffff"
                d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
            />
        </svg>
    )
}

export const ShareIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="20" width="20"><path fill="#ffffff" d="M352 320c-22.6 0-43.4 7.8-59.8 20.9l-102.5-64.1a96.6 96.6 0 0 0 0-41.7l102.5-64.1C308.6 184.2 329.4 192 352 192c53 0 96-43 96-96S405 0 352 0s-96 43-96 96c0 7.2 .8 14.1 2.3 20.8L155.8 180.9C139.4 167.8 118.6 160 96 160c-53 0-96 43-96 96s43 96 96 96c22.6 0 43.4-7.8 59.8-20.9l102.5 64.1A96.3 96.3 0 0 0 256 416c0 53 43 96 96 96s96-43 96-96-43-96-96-96z"/></svg>
    )
}

export const FileIcon = ({mimeType}) => {
    switch (mimeType) {
        case "application/vnd.google-apps.folder":
            return (
                <svg
                    className="w-6 h-6 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7l1-2a2 2 0 012-2h3l2 2h6a2 2 0 012 2v2m-2 10a2 2 0 002-2V7a2 2 0 00-2-2h-6l-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-4H3v4a2 2 0 002 2h14z"
                    ></path>
                </svg>
            )
        case "application/vnd.google-apps.document":
            return (
                <svg
                    className="w-6 h-6 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h9l7 7v9a2 2 0 01-2 2z"
                    ></path>
                </svg>
            )
        case "application/vnd.google-apps.spreadsheet":
            return (
                <svg
                    className="w-6 h-6 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m-6-8h6m2 12H7a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v9a2 2 0 01-2 2z"
                    ></path>
                </svg>
            )
        default:
            return (
                <svg
                    className="w-6 h-6 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11v2m0-6v2m0 4h.01M12 5h.01M17 16H7a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2z"
                    ></path>
                </svg>
            )
    }
}
