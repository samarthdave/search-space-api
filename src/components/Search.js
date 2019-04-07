import React, { Component } from 'react';
import {
  Pane,
  Button,
  Icon,
  SearchInput,
  Dialog,
  Badge,
  Popover,
  TagInput,
  TextInput
} from 'evergreen-ui'; // so.many.imports

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
      currentImage: {},
      // add filter state items
      filterLocations: [], // max one location
      yearStart: '',
      yearEnd: ''
    };

    // put methods into current context
    this.searchInputChange = this.searchInputChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.downloadCurrentImage = this.downloadCurrentImage.bind(this);
    this.loadMoreResults = this.loadMoreResults.bind(this);
    this.addFilterLocation = this.addFilterLocation.bind(this);
    this.updateWithFilters = this.updateWithFilters.bind(this);
    this.updateYearStart = this.updateYearStart.bind(this);
    this.updateYearEnd = this.updateYearEnd.bind(this);

    // temporary addition for testing
    // this.updateSearchResults('Earth');
  }

  async updateSearchResults(query) {
    // grab state values to use for query
    const {
      filterLocations,
      yearStart,
      yearEnd
    } = this.state;
    // determines if any filter is in use
    const filtersUsed = filterLocations.length > 0 || yearStart !== '' || yearEnd !== '';
    // if user removes all input
    if(query.length === 0 && !filtersUsed) {
      this.setState({
        hits: [],
        totalHits: 0
      });
      return;
    }
    // await json response after ensuring clear input
    const response = await NasaAPI.search(query, filterLocations, yearStart, yearEnd);
    
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
      this.setState({
        showDialogBox: true,
        currentImage
      });
    }
  }

  downloadCurrentImage() {
    const { currentImage } = this.state;
    const imageURL = utils.getImageURL(currentImage);
    let win = window.open(imageURL, '_blank');
    win.focus();
  }

  loadMoreResults() {
    if(this.state.MAXRESULTS > this.state.hits.length) {
      return;
    }
    // use functional set state for adding to list
    this.setState((prevState) => {
      return {
        MAXRESULTS: prevState.MAXRESULTS + 10
      };
    });
  }

  addFilterLocation(values) {
    if(values.length > 1) {
      return;
    }
    this.setState({
      filterLocations: values
    });
  }

  updateYearStart(e) {
    const yearStart = e.target.value;
    if(!isNaN(parseInt(yearStart)) || yearStart === '') {
      this.setState({
        yearStart
      });
    }
  }

  updateYearEnd(e) {
    const yearEnd = e.target.value;
    if(!isNaN(parseInt(yearEnd))|| yearEnd === '') {
      this.setState({
        yearEnd
      });
    }
  }

  updateWithFilters() {
    const { searchValue } = this.state;
    this.updateSearchResults(searchValue);
  }

  render() {
    const {
      searchValue,
      totalHits,
      hits,
      MAXRESULTS,
      showDialogBox,
      currentImage,
      filterLocations,
      yearStart,
      yearEnd
    } = this.state;

    // trim results down to max allowed by state
    const trimmedResults = hits.slice(0, MAXRESULTS);
    const displayedResults = trimmedResults.length;
    // setup props for result item
    const resultsPaneProps = {
      searchValue,
      MAXRESULTS,
      hits,
      trimmedResults,
      handleImageClick: this.handleImageClick,
      loadMoreResults: this.loadMoreResults
    };

    const dialogBoxProps = {
      currentImage,
      isShown: showDialogBox,
      onCloseComplete: () => this.setState({ showDialogBox: false }),
      confirmLabel: "Download (new tab)",
      cancelLabel: "Close",
      onConfirm: this.downloadCurrentImage,
    };

    const resultsCounterProps = {
      displayedResults: displayedResults,
      totalHits: totalHits,
      filterLocations,
      addFilterLocation: this.addFilterLocation,
      updateWithFilters: this.updateWithFilters,
      updateYearStart: this.updateYearStart,
      updateYearEnd: this.updateYearEnd,
      yearStart,
      yearEnd
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
        <ResultsCounter {...resultsCounterProps} />

        {/* embed dialog at end of view */}
        <DialogBox {...dialogBoxProps} />
      </Pane>
    ,
      <ResultsPane {...resultsPaneProps} />
    ];
  }
}

function ResultsCounter(props) {
  const {
    totalHits,
    displayedResults,
    addFilterLocation,
    filterLocations,
    updateWithFilters,
    updateYearStart,
    updateYearEnd,
    yearStart,
    yearEnd
  } = props;

  const allowInput = false;
  
  const FilterButton = (
    <Popover
      onClose={updateWithFilters}
      content={
        <Pane
          width={320}
          height={320}
          padding={15}
          display="flex"
          className="filter-pane"
        >
          <div className="filter-hits">
            Location (max 1 item)
            <br />
            <TagInput
              disabled={allowInput}
              height={40}
              inputProps={{ placeholder: 'Mars, New York...' }}
              values={filterLocations}
              onChange={addFilterLocation}
            />
            <br /><br />
            Year Start
            <br />
            <TextInput
              height={40}
              placeholder="1234 (numbers only)"
              value={yearStart}
              onChange={updateYearStart}
            /><br /><br />
            Year End
            <br />
            <TextInput
              height={40}
              placeholder="1234 (numbers only)"
              value={yearEnd}
              onChange={updateYearEnd}
            />
          </div>
        </Pane>
      }
    >
      <Button
        appearance="primary"
        intent="success"
      >
        <Icon icon="filter" size={20} />
        &nbsp;
        Filter
      </Button>
    </Popover>
  );
  return (
    <div className="results-count">
      {FilterButton}
      &nbsp;
      Showing {displayedResults}/{totalHits} results...
    </div>
  );
}

function DialogBox(props) {
  const {
    currentImage
  } = props;

  if(!currentImage) {
    return null;
  }

  const {
    imgURL,
    fullTitle,
    secondaryText,
    description,
    nasa_id,
    date_created
  } = currentImage;

  return (
    <Dialog
      {...props}
      title={fullTitle}
      width={700}
    >
      <img className="dialog-img" src={imgURL} alt={secondaryText} />
      <div className="dialog-info">
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text="Check out this great image I found!" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        <Badge color="green" marginRight={8}>ID: {nasa_id}</Badge>
        <h4>{date_created ? new Date(date_created).toDateString() : ''}</h4>
        {description}
      </div>
    </Dialog>
  );
}

function ResultsPane({ trimmedResults, handleImageClick, loadMoreResults, searchValue }) {
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
        <h2 className="results-heading-text">"<i>{searchValue}</i>"</h2>
        {formattedArray}
        <br/>
        <Button
          className="load-more-btn"
          appearance="primary"
          intent="success"
          onClick={loadMoreResults}
        >
          Load More
        </Button>
        <br/>
      </ul>
      {/* load 10 more results with pagination button */}
    </Pane>
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