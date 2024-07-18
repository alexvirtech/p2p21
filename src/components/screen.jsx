export default function Screen({ stream }) {
    const startScreenShare = async () => {
        // to complete
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex justify-around w-full p-2">
                {/* temp button for starting screen share */}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={startScreenShare}
                >
                    Share Screen
                </button>
            </div>

            <div class="w-full p-2">
                <video autoPlay className="w-full h-auto"></video>
            </div>
        </div>
    )
}
