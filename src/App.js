import React, { useEffect, useRef, useState } from 'react';
import { canvasSize } from './constants';
import './App.css';
import brushes from './rendering/brushes';

function randomColor() {
  return `#${[0, 0, 0]
    .map(() => Math.floor(Math.random() * 256).toString(16))
    .join('')}`;
}

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
  const [context, setContext] = useState(null);
  
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // should never happen

    const ctx = canvas.getContext('2d');
    ctx.fillText('I love Nathaniel'+ctx.canvas.width, 10, 10);

    setContext(ctx);

    const ws = websocketRef.current;
    

    ws.onopen = () => {
      // send a message as soon as the websocket connection is established
      ws.send(
        JSON.stringify({
          messageType: 'hey',
          data: 'Hello peers!',
        })
      );
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);

      switch (message.messageType) {
    
        case 'draw':
          console.log('WebSocket says hello', message.data);
          drawPixel(message.data);
          break;
        case 'hello':
          console.log('WebSocket says hello');
          break;
        case 'hey':
          console.log('Message from another client:', message.data);
          break;
        case 'error':
          console.error(message);
          break;
        default:
          console.error('Unrecognized message format from server');
      }
    };

  }, []);

  const [color, setColor] = useState(() => randomColor());
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
    //console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    //drawPixel({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, color, brush: 'calligraphy' });
  }
    //isDrawing && drawPixel({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, color, brush: 'calligraphy' });
  
  //{ x, y, color, brush }
  const drawPixel = (data) => {
    const brushData = brushes(data.brush);
    context.save();
    context.translate(data.x, data.y);
    context.rotate(brushData.angle);
    context.fillStyle = data.color;
    context.fillRect(-brushData.width / 2, -brushData.height / 2, brushData.width, brushData.height);
    context.restore();
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
            onChange={(e) => setColor(e.target.value)}
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
          <ConnectedUser color="red" name="Example user 1" />
          <ConnectedUser color="blue" name="Example user 2" />
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
