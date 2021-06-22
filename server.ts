import WebSocket from 'ws';
import WS from 'ws';

const wss = new WS.Server({ port: 8000});

interface MessageType {
  type: string,
  message: JSON
}

interface WebSocketExtended extends WebSocket{
  isAlive: boolean,
  id: number,
  partner: WebSocketExtended | null,
  partnerId: number
}

interface ConnectionMessage extends JSON{
  id: number,
  partner: number
}

function noop(){}

function heartbeat(this: any){
	this.isAlive = true;
}

wss.on('connection', function connection(ws: WebSocketExtended) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', function incoming(message: string) {
    //wss.clients.forEach((ws) => (console.log(ws)))
    try{
      let messageObject: MessageType = JSON.parse(message);
      console.log(messageObject)
      if(messageObject.type == "CONNECTION"){
        let connectionMessage: ConnectionMessage = <ConnectionMessage>messageObject.message;
        console.log(`Connection from ${connectionMessage.id}`);
        ws.id = connectionMessage.id;
        let partner = connectionMessage.partner;
        if(partner in wss.clients){
          ws.partner = <WebSocketExtended>(Array.from(wss.clients).filter(partner => (<WebSocketExtended>partner).id == ws.partnerId )[0]);
        }else{
          ws.partner == null;
        }
      }
    } catch(e: any){
      console.log(e.message);
    }
  });
  
  ws.send('Connected');
});

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws){
		if((<WebSocketExtended>ws).isAlive === false) return ws.terminate();
		(<WebSocketExtended>ws).isAlive = false;
		ws.ping(noop);
	});
}, 3000);

wss.on('close', function close(){
	clearInterval(interval);
});
