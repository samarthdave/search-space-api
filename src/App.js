import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';

// import Components after stylesheet import
import Welcome from './components/Welcome';

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

    return [
      <div>Navigation</div>,
      <Switch>
        <div className="App" style={appStyle}>
          <Route exact path="/" component={Welcome} />
          {/* <Route path="/path/to/something" component={ComponentName} />
          <Route component={NotFound} /> */}
        </div>
      </Switch>
    ];
    
  }
}

export default App;