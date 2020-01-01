const imageResultsHelper = (hit) => {
  if(!hit.data) {
    return 0;
  }
  // validate imgURL ref value or default to ''
  let imgURL = '';
  // find an image in the response
  if(hit.links) {
    imgURL = hit.links[0].href;
  } else if(hit.data && hit.data[0].href) {
    imgURL = hit.data[0].href;
  }

  // refine for secondary
  let secondaryText = '';
  let allData;
  if(hit.data[0] && hit.data[0].secondary_creator) {
    secondaryText = hit.data[0].secondary_creator;
  }

  if(hit.data[0]) {
    allData = hit.data[0];
  }
  // validate title value
  let title = '';
  let fullTitle = '';
  if(hit.data) {
    // untrimmed title
    fullTitle = hit.data[0].title;
    // cut title off at 30 characters
    title = hit.data[0].title.slice(0,30);
  }

  // parse date input
  let date_created;
  if(allData.date_created) {
    date_created = new Date(allData.date_created);
  }

  return {
    ...allData,
    imgURL,
    fullTitle,
    title,
    date_created,
    secondaryText
  };
};

const getBadges = (hit) => {
  let keywords = [];
  // if the keywords array exists
  if(hit.data[0] && hit.data[0].keywords) {
    keywords = hit.data[0].keywords;
  }
  
  // filter based on if string
  keywords = keywords
    .filter((keyword) => {
      return typeof keyword === "string";
    })
    // trim the label/string if too long
    .map((keyword) => {
      if(keyword.length >= 15) {
        keyword = keyword.slice(0, 12) + '...';
      }
      return keyword;
    });
    // trim results down to max of 10 labels
    // .slice(0, 10);

  return keywords;
};

const getImageURL = (hit) => {
  if(hit.imgURL) {
    return hit.imgURL;
  }
  if(hit.links) {
    return hit.links[0].href;
  } else if(hit.data && hit.data[0].href) {
    return hit.data[0].href;
  }
  // backup just in case
  return 'https://searchspace.surge.sh/static/media/background-min.2558a1d1.png';
};

// GetBadgeColors --> a generic function to return N number of colors
const getBadgeColors = (count) => {
  if (typeof count != "number") return; // must be a #

  let items = ['teal', 'red', 'orange', 'green', 'blue', 'purple', 'yellow'];

  if (count <= items.length) return items.slice(0, count);

  // repeat the above array items enough times to match N items
  // eg. count = 15; final = [teal ... yellow, teal ... yellow, +1 (teal)]
  const final = [];
  
  const times = Math.floor(count / items.length);
  const remainder = count % items.length;
  for (let i = 0; i < times; i++) {
    final.push(...items);
  }
  
  // if there are some extra
  if (remainder) final.push(...items.slice(0, remainder));

  return final;
}

export default {
  imageResultsHelper,
  getBadges,
  getImageURL,
  getBadgeColors
}