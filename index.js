const WebSocket = require('ws');
const wss = new WebSocket.Server({ port:8082}, () => {
    console.log('Server listening on port ', wss.options.port);
});

//Below, wss object refers to the WebSocket server while ws refers to a particular client connection
//So, if multiple clients connects to the server there will be multiple ws objects
wss.on('connection', (ws, req) => {
    console.log('New Client connected! ID: ', req.headers["sec-websocket-key"]);

    ws.on('message', (data) => {
        console.log(`Client has sent: ${data}`);
        //ws.send(data.toUpperCase());
        wssBroadcast(data.toUpperCase());
        //wssBroadcastEx(data.toUpperCase(), ws);
    })

    ws.on('close', () => {
        console.log('Client has disconnected!');
    })
});

//Function to broadcast to all clients:
function wssBroadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
    });
};

//Function to broadcast to all clients except to the one who sent the message
function wssBroadcastEx (data, ws){
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
}