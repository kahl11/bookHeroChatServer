"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var wss = new ws_1.default.Server({ port: 8000 });
function noop() { }
function heartbeat() {
    this.isAlive = true;
}
wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', function incoming(message) {
        //wss.clients.forEach((ws) => (console.log(ws)))
        try {
            var messageObject = JSON.parse(message);
            console.log(messageObject);
            if (messageObject.type == "CONNECTION") {
                var connectionMessage = messageObject.message;
                console.log("Connection from " + connectionMessage.id);
                ws.id = connectionMessage.id;
                var partner = connectionMessage.partner;
                if (partner in wss.clients) {
                    ws.partner = (Array.from(wss.clients).filter(function (partner) { return partner.id == ws.partnerId; })[0]);
                }
                else {
                    ws.partner == null;
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }
    });
    ws.send('Connected');
});
var interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false)
            return ws.terminate();
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 3000);
wss.on('close', function close() {
    clearInterval(interval);
});
