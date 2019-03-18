import React, { Component } from 'react';
import { Pane, Button, Icon, SearchInput, Dialog } from 'evergreen-ui';
import Quote from 'inspirational-quotes';

import { NasaAPI } from '../api';
import utils from '../utils';

import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // search input latency before ajax request
      searchValue: '',
      typing: false,
      typingTimeout: 0,
      // ajax results stored here
      totalHits: 0,
      hits: [],
      MAXRESULTS: 10,
      // modal/dialog box setup
      showDialogBox: false,
      dialogText: ''
    };

    // put methods into current context
    this.searchInputChange = this.searchInputChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);

    // temporary addition for testing
    // this.updateSearchResults('rover');
  }

  async updateSearchResults(query) {
    // if user removes all input
    if(query.length === 0) {
      this.setState({
        hits: [],
        totalHits: 0
      });
      return;
    }
    // await json response after ensuring clear input
    const response = await NasaAPI.search(query);
    
    // set default values
    let hits = [];
    let totalHits = 0;

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
    const { typingTimeout } = this.state;
    if(typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const searchValue = e.target.value;
    this.setState({
      searchValue,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.updateSearchResults(searchValue);
      }, 400)
    });
  }

  handleImageClick(loc) {
    const { totalHits, hits } = this.state;
    if(loc < totalHits-1) {
      // extract title from result input
      const { title } = utils.imageResultsHelper(hits[loc]);
      this.setState({
        showDialogBox: true,
        dialogText: title
      });
    }
  }

  render() {
    const {
      searchValue,
      totalHits,
      hits,
      MAXRESULTS,
      showDialogBox,
      dialogText
    } = this.state;

    // trim results down to max allowed by state
    const trimmedResults = hits.slice(0, MAXRESULTS);
    const displayedResults = trimmedResults.length;
    // map into renderable component
    const Results = trimmedResults
      // use results helper to change array items
      .map((result) => utils.imageResultsHelper(result))
      .map(({ imgURL, title, secondaryText }, i) => (
        <div className="result-pane" key={i} onClick={() => this.handleImageClick(i)}>
          <img className="thumbnail" src={imgURL} alt="Trulli" />
          <span className="support-text">{title}</span>
          <span className="secondary-text">{secondaryText}</span>
        </div>
      ));

    return (
      <Pane
        className="search-pane"
        border="extraMuted"
      >
        <h1 className="search-pane-title">Begin your journey</h1>
        <InspirationBlock />
        {/* surround Input w/styling div */}
        <SearchContainer
          searchValue={searchValue}
          onChange={this.searchInputChange}
        />
        {/* Show result count and images */}
        <div className="results-count">
          Showing {displayedResults}/{totalHits} results...
        </div>
        <div className="results">
          <ul>
            {Results}
          </ul>
        </div>

        {/* embed dialog at end of view */}
        <Dialog
          isShown={showDialogBox}
          title="Danger intent"
          intent="danger"
          onCloseComplete={() => this.setState({ showDialogBox: false })}
          confirmLabel="Delete Something"
        >
          {dialogText}
        </Dialog>
      </Pane>
    );
  }
}

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
    } while (quote.length > 220);

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

function SearchContainer({ searchValue, onChange }) {
  return (
    <div className="search-input">
      <SearchInput
        width="100%"
        height={40}
        placeholder='Search for ... (e.g. "Rover")'
        value={searchValue}
        onChange={onChange}
        autoFocus
      />
    </div>
  );
}

export default Search;