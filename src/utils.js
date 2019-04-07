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
    // trim the string if too long
    .map((keyword) => {
      if(keyword.length > 30) {
        keyword = keyword.slice(0, 25) + '...';
      }
      return keyword;
    })
    // trim results down to max of 5 labels
    .slice(0,5);

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

export default {
  imageResultsHelper,
  getBadges,
  getImageURL
}