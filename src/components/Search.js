import React, { Component } from 'react';
import { Pane } from 'evergreen-ui';

import { NasaAPI } from '../api';
import utils from '../utils';

import InspirationBlock from './InspirationBlock';
import DialogBox from './DialogBox';
import ResultsCounter from './ResultsCounter';
import ResultsPane from './ResultsPane';
import SearchContainer from './SearchContainer';

import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // search input latency before ajax request
      // https://stackoverflow.com/questions/42217121/searching-in-react-when-user-stops-typing
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
    // this.updateSearchResults('ship');
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

  downloadCurrentImage() { // open image url in a new tab
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
    
    return (
      <>
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

      <ResultsPane {...resultsPaneProps} />
    </>
    );
  }
}

export default Search;