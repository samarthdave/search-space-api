import React, { Component } from 'react';
import { Pane, Button, Icon, SearchInput } from 'evergreen-ui';
import Quote from 'inspirational-quotes';

import { NasaAPI } from '../api';

import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      author: '',
      searchValue: ''
    };

    // put methods into current context
    this.setQuote = this.setQuote.bind(this);
    this.searchInputChange = this.searchInputChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
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

  async updateSearchResults(query) {
    const results = await NasaAPI.search(query);
    console.log(results);
  }

  searchInputChange(e) {
    const searchValue = e.target.value;
    this.setState({
      searchValue
    }, () => { // do something after setState
      this.updateSearchResults(searchValue);
    });
  }

  render() {
    const {
      quote,
      author,
      searchValue
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
          <SearchInput
            width="100%"
            height={40}
            placeholder='Search for ... (e.g. "Mars")'
            value={searchValue}
            onChange={this.searchInputChange}
          />
        </div>
      </Pane>
    );
  }
}

export default Search;