import React, { useEffect, useRef, useState } from 'react';
import { canvasSize } from './constants';
import './App.css';
import brushes from './rendering/brushes';

/*function randomColor() {
  return `#${[0, 0, 0]
    .map(() => Math.floor(Math.random() * 256).toString(16))
    .join('')}`;
}*/

let websocket;
function getWebSocket() {
  return (websocket =
    websocket || new WebSocket(`ws://${window.location.hostname}:4040`));
}

function App() {
  /**
   * @type {React.RefObject<HTMLCanvasElement>}
   * */
  const canvasRef = useRef(null);
  const websocketRef = useRef(getWebSocket());
  
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ uid: -1, color: '#000000' });
  const [color, setColor] = useState('#000000');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // should never happen

    const ctx = canvas.getContext('2d');
    ctx.fillText('Hi all', 10, 10);

    const ws = websocketRef.current;
    
    ws.onopen = () => {
      // User color has been created on server; nonetheless, user and random color object could have been handled here
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);

      switch (message.messageType) {
        case 'draw':
          drawPixel(message.data, ctx);
          break;
        case 'userId':
          setUser(message.user);
          setColor(message.user.color)
          break;
        case 'users':
          setUsers(message.users)
          break;
        case 'error':
          console.error(message);
          break;
        default:
          console.error('Unrecognized message format from server');
      }
    };

  }, []);

  const onPickColor = (e) => {
    setColor(e.target.value)
    websocketRef.current.send(
      JSON.stringify({
        messageType: 'userColorChange',
        data: { uid: user.uid, color: e.target.value}
      })
    );
  }
  const onDrawEvent = (e) =>
  {
    if (!isDrawing) {
      return;
    }
    const toSend = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      color: color,
      brush: 'calligraphy'
    
    }
    websocketRef.current.send(
      JSON.stringify({
        messageType: 'draw',
        data: toSend,
      })
    );
  }

  const drawPixel = (data, ctx) => {
    const brushData = brushes(data.brush);
    ctx.save();
    ctx.translate(data.x, data.y);
    ctx.rotate(brushData.angle);
    ctx.fillStyle = data.color;
    ctx.fillRect(-brushData.width / 2, -brushData.height / 2, brushData.width, brushData.height);
    ctx.restore();
  };

  
  return (
    <div className="app">
      <header>
        <h1>Pixel paint</h1>
        <div className="color_selection">
          Your color:{' '}
          <input
            type="color"
            value={color}
            onChange={(e) => onPickColor(e)}
          />
        </div>
      </header>
      <main className="main_content">
        <div className="canvas_container">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={()=>setIsDrawing(true)}
            onMouseMove={onDrawEvent}
            onMouseUp={()=>setIsDrawing(false)}
            onMouseOut={()=>setIsDrawing(false)}
          />
        </div>
        <div>
          <h3 className="connected_users_title">Connected users</h3>
          {
            users.map((user) => (
                <ConnectedUser key={user.uid} color={user.color} name={'user_'+user.uid} />
            ))
          }

        </div>
      </main>
    </div>
  );
}

function ConnectedUser({ color, name }) {
  return (
    <div className="connected_user">
      <div className="user_color" style={{ '--user-color': color }} />
      <div>{name}</div>
    </div>
  );
}

export default App;
