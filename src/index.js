import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Pane, Text, Button } from "evergreen-ui";

import "./styles.css";

class App extends Component {
  // set state with background image using CommonJS
  state = {
    currentBackgroundImage: require("./media/background-min.png"),
    currentImage: "index",
    imageList: {
      index: {
        relativeLocation: "./media/background-min.png",
        stylePreferences: {
          backgroundSize: "cover"
        }
      }
    }
  };
  render() {
    const { currentBackgroundImage, currentImage, imageList } = this.state;
    // copy style preferences
    const appStyle = Object.assign(
      {},
      imageList[currentImage].stylePreferences
    );
    // Add current image to location
    appStyle.backgroundImage = `url(${currentBackgroundImage})`;

    return (
      <div className="App" style={appStyle}>
        <Pane
          className="jumbotron"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          border="muted"
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
}
// function App() {
//   const appStyle = {
//     backgroundImage: `url(${Background})`
//   };

// }

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
