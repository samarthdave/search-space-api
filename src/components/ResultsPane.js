import React from 'react';
import {
  Pane,
  Button,
  Badge
} from 'evergreen-ui';

import utils from '../utils';

function ResultsPane({ trimmedResults, handleImageClick, loadMoreResults, searchValue }) {
  // map into renderable component
  const respectiveBadges = trimmedResults
    // use utils to return array for each result
    .map((result) => utils.getBadges(result))
    // replace each with a badge
    .map((tagsList) => {
      return tagsList // map and return a badge for each
        .map((badgeString) => (
          <Badge isSolid color="neutral" marginRight={8}>{badgeString}</Badge>
        )).slice(0, 3);
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

export default ResultsPane;