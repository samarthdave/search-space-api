import React, { Component } from 'react';
import { Pane, Button } from 'evergreen-ui';

import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Welcome.css';

class Welcome extends Component {
  render() {
    return (
      <Pane
        className="jumbotron"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="muted"
      >
        <h1 className="jumbotron-title">SearchSpace <FontAwesomeIcon icon={faSpaceShuttle} /></h1>
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
    );
  }
}

export default Welcome;