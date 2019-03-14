import React from "react";
import ReactDOM from "react-dom";

import Background from "./media/background-min.png";
import { Pane, Text, Button } from "evergreen-ui";

import "./styles.css";

function App() {
  const appStyle = {
    backgroundImage: `url(${Background})`
  };
  return (
    <div className="App" style={appStyle}>
      <Pane
        className="jumbotron"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="default"
      >
        <h1 className="jumbotron-title">SearchSpace &#128640;</h1>
        <h2 className="jumbotron-subtitle">Explore beyond and within</h2>
        <Button
          appearance="primary"
          intent="success"
          id="get-started-btn"
          alignItems="center"
          justifyContent="center"
          height={40}
        >
          Get started
        </Button>
      </Pane>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
