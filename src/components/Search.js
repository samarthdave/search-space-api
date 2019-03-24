import React, { Component } from 'react';
import { Pane, Button, Icon, SearchInput, Dialog, Badge } from 'evergreen-ui';

import { NasaAPI } from '../api';
import InspirationBlock from './InspirationBlock';
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
      MAXRESULTS: 20,
      // modal/dialog box setup
      showDialogBox: false,
      // current image data
      currentImage: {}
    };

    // put methods into current context
    this.searchInputChange = this.searchInputChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.downloadCurrentImage = this.downloadCurrentImage.bind(this);

    // temporary addition for testing
    this.updateSearchResults('Earth');
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

    // if okay response
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
    // create 400 ms difference from typing to ajax request
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
    // if valid location
    if(loc < totalHits-1) {
      // grab data from helper and inject into dialog box
      const currentImage = utils.imageResultsHelper(hits[loc]);
      console.log(currentImage);
      this.setState({
        showDialogBox: true,
        currentImage
      });
    }
  }

  downloadCurrentImage() {
  }

  render() {
    const {
      searchValue,
      totalHits,
      hits,
      MAXRESULTS,
      showDialogBox,
      currentImage
    } = this.state;

    // trim results down to max allowed by state
    const trimmedResults = hits.slice(0, MAXRESULTS);
    const displayedResults = trimmedResults.length;
    // setup props for result item
    const resultsPaneProps = {
      MAXRESULTS,
      hits,
      trimmedResults,
      handleImageClick: this.handleImageClick
    };

    const dialogBoxProps = {
      currentImage,
      isShown: showDialogBox,
      onCloseComplete: () => this.setState({ showDialogBox: false }),
      confirmLabel: "Download",
      cancelLabel: "Close",
      onConfirm: this.downloadCurrentImage,
    };
    
    return [
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
        <ResultsCounter displayedResults={displayedResults} totalHits={totalHits} />

        {/* embed dialog at end of view */}
        <DialogBox {...dialogBoxProps} />
      </Pane>
    ,
      <ResultsPane {...resultsPaneProps} />
    ];
  }
}

function DialogBox(props) {
  const {
    currentImage
  } = props;

  console.log(currentImage)
  if(!currentImage) {
    return null;
  }

  const {
    imgURL,
    fullTitle,
    secondaryText,
    description,
    nasa_id
   } = currentImage;

  console.log(currentImage);
  return (
    <Dialog
      {...props}
      title={fullTitle}
      width={700}
    >
      <img className="dialog-img" src={imgURL} alt={secondaryText} />
      <p className="dialog-info">
        <Badge color="green" marginRight={8}>ID: {nasa_id}</Badge>
        <h4></h4>
        {description}
      </p>
    </Dialog>
  );
}

function ResultsPane({ trimmedResults, handleImageClick }) {
  // map into renderable component
  const respectiveBadges = trimmedResults
    // use utils to return array for each result
    .map((result) => utils.getBadges(result))
    // replace each with a badge
    .map((tagsList) => {
      return tagsList // map and return a badge for each
        .map((badgeString) => (
          <Badge color="neutral" isSolid marginRight={8}>{badgeString}</Badge>
        ));
    });
  
  const formattedArray = trimmedResults
    // use results helper to change array items
    .map((result) => utils.imageResultsHelper(result))
    .map(({ imgURL, title, secondaryText }, i) => (
      <figure
        className="result-pane" key={i}
        onClick={() => handleImageClick(i)}
      >
        <img className="thumbnail" src={imgURL} alt={secondaryText} />
        <figcaption>
          {title}
          <br/>
          {respectiveBadges[i]}
        </figcaption>
      </figure>
    ));

  // determine if display none needs to be added
  const shouldShowEmpty = formattedArray.length === 0;
  const resultsStyle = {
    display: shouldShowEmpty ? 'none' : 'block'
  };
  return (
    <Pane
      className="results-pane"
      border="extraMuted">
      <ul id="results-list" style={resultsStyle}>
        {formattedArray}
      </ul>
    </Pane>
  );
}

function ResultsCounter({ totalHits, displayedResults }) {
  return (
    <div className="results-count">
      { totalHits > 0 ?
        <Button
          appearance="primary"
          intent="success"
        >
          <Icon icon="filter" size={20} />
          &nbsp;
          Filter
        </Button>: ''
      }
      &nbsp;
      Showing {displayedResults}/{totalHits} results...
    </div>
  );
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