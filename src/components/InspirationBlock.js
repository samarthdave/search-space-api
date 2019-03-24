import React, { Component } from 'react';
import { Button, Icon } from 'evergreen-ui';

import { Quote } from '../api';

class InspirationBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      author: ''
    };
    // bind to context
    this.setQuote = this.setQuote.bind(this);
  }
  componentDidMount() {
    this.setQuote();
  }
  setQuote() {
    let quote = '';
    let author = '';
    // loop through and select a quote that isn't too long
    do {
      // destructure and reassign
      ({ text: quote, author } = Quote.getQuote());
      // filter quotes that are too long and no repeats! (if small list)
    } while (quote.length > 220 || quote === this.state.quote);

    this.setState({
      quote,
      author
    });
  }

  render() {
    const { quote, author } = this.state;
    return (
      <h2 className="search-pane-subtitle">
        {quote} - {author}
        &nbsp;
        <Button
          onClick={this.setQuote}
          appearance="primary"
        >
          <Icon icon="refresh" />
        </Button>
      </h2>
    );
  }
}

export default InspirationBlock;