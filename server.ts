import WS from 'ws';

const wss = new WS.Server({ port: 8000 });

interface MessageType {
  type: string;
  message: string
}

wss.on('connection', function connection(ws: any) {
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