import WS from 'ws';

const wss = new WS.Server({ port: 8000});

interface MessageType {
  type: string;
  message: string
}

function noop(){}

function heartbeat(){
	this.isAlive = true;
}

wss.on('connection', function connection(ws: any) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', function incoming(message: string) {
    console.log(message);
    try{
      let messageObject: MessageType = JSON.parse(message);
      if(messageObject.type == "CONNECTION"){
        console.log(messageObject.message);
      }
    } catch(e){
      console.log('not json');
    }
  });
  
  ws.send('Connected');
});

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws){
		if(ws.isAlive === false) return ws.terminate();

		ws.isAlive = false;
		ws.ping(noop);
	});
}, 30000);

wss.on('close', function close(){
	clearInterval(interval);
});
