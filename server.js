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
            console.log('got message: ', message);
            var messageObject = JSON.parse(message);
            if (messageObject.type == "CONNECTION") {
                var connectionMessage_1 = messageObject.message;
                ws.id = connectionMessage_1.id;
                console.log("looking for: " + connectionMessage_1.partner);
                Array.from(wss.clients).map(function (partner) {
                    console.log("found: " + partner.id);
                    if (partner.id === connectionMessage_1.partner) {
                        ws.partner = partner;
                        partner.partner = ws;
                    }
                });
                //console.log(ws.partner);
            }
            else if (messageObject.type == "MESSAGE") {
                if (ws.partner)
                    ws.partner.send(message);
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
