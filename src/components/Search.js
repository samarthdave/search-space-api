import React, { Component } from 'react';
import { Pane, Button, Icon, TagInput } from 'evergreen-ui';
import Quote from 'inspirational-quotes';

import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      author: '',
      searchValues: []
    };
    this.setQuote = this.setQuote.bind(this);
  }

  componentWillMount() {
    this.setQuote();
  }

  setQuote() {
    let quote = '';
    let author = '';

    // loop through and select a quote that isn't too long
    do {
      // destructure and reassign
      ({ text: quote, author } = Quote.getQuote());
    } while (quote.length > 220);

    this.setState({
      quote,
      author
    });
  }

  render() {
    const {
      quote,
      author,
      searchValues
    } = this.state;

    return (
      <Pane
        className="search-pane"
        border="extraMuted"
      >
        <h1 className="search-pane-title">Begin your journey</h1>
        <h2 className="search-pane-subtitle">
          {quote} - {author}
          &nbsp;<Button
            onClick={this.setQuote}
            appearance="primary"
          >
            <Icon icon="refresh" />
          </Button>
        </h2>
        {/* surround Input w/styling div */}
        <div className="search-input">
          <TagInput
            inputProps={{ placeholder: 'Search for ... (e.g. Mars)' }}
            width="80%"
            values={searchValues}
            onChange={(valuess) => { console.log(valuess); }}
          />
        </div>
      </Pane>
    );
  }
}

export default Search;