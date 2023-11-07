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

const randomColor = () => {
  return `#${[0, 0, 0]
    .map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
    .join('')}`;
}

wsServer.on('connection', (ws) => {
  console.log('WS client connected.');
  
  const currentUid = uidCounter++;
  const userColor = randomColor();
  
  users.push({uid: currentUid, color: userColor});
  
  ws.send(JSON.stringify({
    messageType: 'userId',
    user: { uid: currentUid, color: userColor }
  }));

  
  for (const client of wsServer.clients) {
    client.send(
      JSON.stringify({
        messageType: 'users',
        users,
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
    
    if(message.messageType === 'userColorChange' && typeof message.data === 'object') {
      console.log(message.data)
      users = users.map(x=> (x.uid === message.data.uid) ? {uid: x.uid, color: message.data.color} : x)
      console.log(users)
      //users = users.map((user) => user.uid === message.uid ? {...user, color:message.color} : {...user});
      for (const client of wsServer.clients) {
        client.send(
          JSON.stringify({
            messageType: 'users',
            users: users,
          })
        );
      }
    }

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
