export default function Status({ isConnected }) {
    return <div class="p-4 border-t border-gray-400">
        <div class="text-center">{isConnected ? "Connected" : "Not connected"}</div>
    </div>
}
