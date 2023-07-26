import React, { useEffect, useRef } from 'react';
import { canvasSize } from './constants';
import './App.css';

function App() {
  /**
   * @type {React.RefObject<HTMLCanvasElement>}
   * */
  const canvasRef = useRef(null);
  const websocketRef = useRef(
    new WebSocket(`ws://${window.location.hostname}:4040`)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // should never happen

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

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

  return (
    <div className="app">
      <header>
        <h1>Pixel paint</h1>
        <div className="color_selection">
          TO BE IMPLEMENTED: Color selection goes here.
        </div>
      </header>
      <main className="main_content">
        <div className="canvas_container">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
          />
          <div className="delete_me_message">
            TO BE IMPLEMENTED: canvas content (delete this tag).
          </div>
        </div>
        <div className="connected_users">
          TO BE IMPLEMENTED: Connected users go here.
        </div>
      </main>
    </div>
  );
}

export default App;
