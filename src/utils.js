const imageResultsHelper = (hit) => {
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
  if(hit.data[0] && hit.data[0].secondary_creator) {
    secondaryText = hit.data[0].secondary_creator;
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

  return {
    imgURL,
    fullTitle,
    title,
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
    });

  return keywords;
};

export default {
  imageResultsHelper,
  getBadges
}