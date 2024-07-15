const peerConfig = {
    host: 'wss2.mtw-testnet.com',
    path: '/peerjs/myapp'
}

const peerConfig1 = {
    //host: 'wss2.mtw-testnet.com',
    //path: '/peerjs/myapp',
    config: {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
                urls: "turn:standard.relay.metered.ca:443",
                username: "13bc22c6d7ffd548f62b9557",
                credential: "vAOlbk9/uyITlI1m",
            },
            {
                urls: "turns:standard.relay.metered.ca:443?transport=tcp",
                username: "13bc22c6d7ffd548f62b9557",
                credential: "vAOlbk9/uyITlI1m",
            },
        ],
    },
}