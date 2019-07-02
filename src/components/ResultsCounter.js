import React from 'react';
import {
  Pane,
  Button,
  Icon,
  Popover,
  TagInput,
  TextInput
} from 'evergreen-ui';

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

export default ResultsCounter;