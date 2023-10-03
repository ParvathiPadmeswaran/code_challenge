import React from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import Notifications from "./components/Notifications";
import "./App.css";

function App() {
  // Implement routing and state management as needed
  return (
    <div className="App">
      <header>
        <h1>Real-Time Chat App</h1>
      </header>
      <main>
        <Auth />
        <Chat />
        <Notifications />
      </main>
    </div>
  );
}

export default App;
