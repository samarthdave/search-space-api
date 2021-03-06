import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Button } from 'evergreen-ui';

import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Welcome.css';

function Welcome(props) {
  return (
    <Pane
      className="jumbotron"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      border="extraMuted"
    >
      <h1 id="jumbotron-title">SearchSpace <FontAwesomeIcon icon={faSpaceShuttle} /></h1>
      <h2 id="jumbotron-subtitle">Explore within and search beyond</h2>
      <h3 id="jumbotron-helper">Search NASA's beautiful repository of images</h3>
      
      <Button
        appearance="primary"
        intent="success"
        id="get-started-btn"
        alignItems="center"
        justifyContent="center"
        height={40}
      >
        <Link to="/search">Get started</Link>
      </Button>
    </Pane>
  );
}

export default Welcome;