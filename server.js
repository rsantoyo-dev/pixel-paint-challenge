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


let users = [];
let uidCounter = 0;
wsServer.on('connection', (ws) => {
  console.log('WS client connected.');
  

  
  const currentUid = uidCounter++;
  const userColor = '#' + (Math.random() * 0xffffff).toString(16).slice(0, 6);
  
  users.push({uid: currentUid, color: userColor});
  console.log(users)
  
  for (const client of wsServer.clients) {
    client.send(
      JSON.stringify({
        messageType: 'users',
        data: users,
      })
    );
  }
  
  ws.send(
    JSON.stringify({
      messageType: 'hello',
      data: 'Hello client!',
    })
  );

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());

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
    users = users.filter((user) => user.uid !== currentUid);
    console.log(users);
    for (const client of wsServer.clients) {
      client.send(
        JSON.stringify({
          messageType: 'users',
          data: users,
        })
      );
    }
    
  });
  

  ws.onerror = console.error;
});
