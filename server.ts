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
	    console.log('got message: ', message);
      let messageObject: MessageType = JSON.parse(message);
      if(messageObject.type == "CONNECTION"){
        let connectionMessage: ConnectionMessage = <ConnectionMessage>messageObject.message;
        ws.id = connectionMessage.id;
	console.log("looking for: " + connectionMessage.partner);
        Array.from(wss.clients).map(partner => { 	
		console.log("found: "+(<WebSocketExtended>partner).id);
		if( (<WebSocketExtended>partner).id === connectionMessage.partner){
			ws.partner = <WebSocketExtended>partner;
			(<WebSocketExtended>partner).partner = ws;
		}
	}
       );
	//console.log(ws.partner);
      }else if(messageObject.type == "MESSAGE"){
	      if(ws.partner)
	      		ws.partner.send(message);
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
