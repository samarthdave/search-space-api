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
      searchValue: '',
      totalHits: 0,
      hits: [],
      MAXRESULTS: 10
    };

    // put methods into current context
    this.setQuote = this.setQuote.bind(this);
    this.searchInputChange = this.searchInputChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);

    this.updateSearchResults('rover');
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
    // if user removes all input
    console.log(query, query.length, query.length===0)
    if(query.length === 0) {
      this.setState({
        hits: [],
        totalHits: 0
      });
      return;
    }
    const response = await NasaAPI.search(query);
    
    let hits = [];
    let totalHits = -4;

    if(response.status === 200) {
      totalHits = response.data.collection.metadata.total_hits;
      if(totalHits !== 0) {
        hits = response.data.collection.items;
      }
    }

    this.setState({
      hits,
      totalHits
    });
  }

  searchInputChange(e) {
    const searchValue = e.target.value;
    this.setState({
      searchValue
    }, () => { // do something after setState
      this.updateSearchResults(searchValue);
    });
  }

  imageResultsHelper(hit) {
    // validate imgURL ref value or default to ''
    let imgURL = '';
    if(hit.links) {
      imgURL = hit.links[0].href;
    } else if(hit.data && hit.data[0].href) {
      imgURL = hit.data[0].href;
    }
    // validate title value
    let title = '';
    if(hit.data) {
      // cut title off at 30 characters
      title = hit.data[0].title.slice(0,30);
    }
    return {
      imgURL,
      title
    };
  }

  render() {
    const {
      quote,
      author,
      searchValue,
      totalHits,
      hits,
      MAXRESULTS
    } = this.state;

    // trim results down to max allowed by state
    const Results = hits.slice(0, MAXRESULTS)
      // use results helper to change array items
      .map((result) => this.imageResultsHelper(result))
      .map(({ imgURL, title }, i) => (
        <div className="result-pane" key={i}>
          <img className="thumbnail" src={imgURL} alt="Trulli" />
          <span className="support-text">{title}</span>
        </div>
      ));

    return (
      <Pane
        className="search-pane"
        border="extraMuted"
      >
        <h1 className="search-pane-title">Begin your journey</h1>
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
        <div className="results-count">
          Showing {totalHits} results...
        </div>
        <div className="results">
          <ul>
            {Results}
          </ul>
        </div>
      </Pane>
    );
  }
}

export default Search;