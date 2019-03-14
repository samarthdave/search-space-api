import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <div className="jumbotron">
        <h1 className="jumbotron-title">SearchSpace &#128640;</h1>
        <h2 className="jumbotron-subtitle">Explore beyond and within</h2>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
