"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var wss = new ws_1.default.Server({ port: 8000 });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(message);
        try {
            var messageObject = JSON.parse(message);
            if (messageObject.type == "CONNECTION") {
                console.log(messageObject.message);
            }
        }
        catch (e) {
            console.log('not json');
        }
    });
    ws.send('Connected');
});
