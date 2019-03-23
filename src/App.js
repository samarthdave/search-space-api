import React, { Component } from 'react';

import MinimalNavbar from './components/MinimalNavbar';

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
  }

  componentDidMount() {
    document.title = 'SearchSpace - Explore within/search beyond';
  }

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
        <MinimalNavbar />
        {this.props.children}
      </div>
    );
  }
}

export default App;