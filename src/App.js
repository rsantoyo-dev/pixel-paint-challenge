import "./App.css";

function App() {
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
          <canvas width={300} height={200} />
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
