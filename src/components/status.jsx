export default function Status({ isConnected }) {
    return <div class="text-center">{isConnected ? "Connected" : "Not connected"}</div>
}