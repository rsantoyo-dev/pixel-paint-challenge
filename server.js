const express = require('express');
const path = require('path');
const app = express();
const { WebSocketServer } = require('ws');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);

const wsServer = new WebSocketServer({ port: 4040 });

wsServer.on('connection', (ws) => {
  console.log('WS client connected.');

  ws.send(
    JSON.stringify({
      messageType: 'hello',
    })
  );

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());

    console.log('received message', message);

    if(message.messageType === 'draw' && typeof message.data === 'object') {
      for (const client of wsServer.clients) {
        client.send(
          JSON.stringify({
            messageType: 'draw',
            data: {
              x: message.data.x,
              y: message.data.y,
              color: message.data.color,
              brush: message.data.brush,
            },
          })
        );
      }
    }
    else{
      if (message.messageType === 'hey' && typeof message.data === 'string') {
        for (const client of wsServer.clients) {
          client.send(
            JSON.stringify({
              messageType: 'hey',
              data: message.data,
            })
          );
        }
      } else {
        ws.send(
          JSON.stringify({
            messageType: 'error',
            data: 'Client sent an unrecognized message format',
            originalMessage: message,
          })
        );
      }
    }
    
  });

  ws.on('close', () => {
    console.log('WS client disconnected.');
  });

  ws.onerror = console.error;
});
