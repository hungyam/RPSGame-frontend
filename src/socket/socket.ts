import {io} from "socket.io-client";

const socket = io("wss://yanxu.site:1100");

// const socket = io("ws://192.168.1.112:1100");

socket.on("connect", () => {
    console.log(socket.id);
});

export default socket
