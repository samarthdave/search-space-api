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
  if(hit.data) {
    // cut title off at 30 characters
    title = hit.data[0].title.slice(0,30);
  }

  return {
    imgURL,
    title,
    secondaryText
  };
};


export default {
  imageResultsHelper
}