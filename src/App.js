import React, { Component } from 'react';

import './App.css';

class App extends Component {
  // set state with background image using CommonJS
  state = {
    currentBackgroundImage: require('./media/background-min.png'),
    currentImage: 'index',
    imageList: {
      index: {
        relativeLocation: './media/background-min.png',
        stylePreferences: {
          backgroundSize: 'cover'
        }
      }
    }
  };

  render() {
    // destructure variables from state
    const {
      currentBackgroundImage,
      currentImage,
      imageList
    } = this.state;
    // copy style preferences

    const appStyle = Object.assign({}, imageList[currentImage].stylePreferences);
    // Add current image to location
    appStyle.backgroundImage = `url(${currentBackgroundImage})`;

    return (
      <div className="App" style={appStyle}>
        {/* <Navbar /> */}
        {this.props.children}
      </div>
    );
  }
}

export default App;