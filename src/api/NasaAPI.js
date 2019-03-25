import axios from 'axios';

const APIURL = 'https://images-api.nasa.gov';
const searchEndpoint = (q, locations, yearStart, yearEnd) => {
  const queryStrings = [];
  // add q
  if(q !== '') {
    queryStrings.push(`q=${q}`);
  }
  // add location
  if(locations.length !== 0) {
    queryStrings.push(`location=${locations[0]}`);
  }
  // year start and end
  if(yearStart !== '') {
    queryStrings.push(`year_start=${yearStart}`);
  }
  if(yearEnd !== '') {
    queryStrings.push(`year_end=${yearEnd}`);
  }
  // concatenate all query strings
  const finalQueryString = queryStrings.join('&');
  return `${APIURL}/search?${finalQueryString}`;
};
const assetEndpoint = (nasa_id) => `${APIURL}/asset/${nasa_id}`;
const metaDataEndpoint = (nasa_id) => `${APIURL}/metadata/${nasa_id}`;
const captionsEndpoint = (nasa_id) => `${APIURL}/captions/${nasa_id}`;

// return a promise on each with axios so "await" is supported
export default {
  search: (q, locations, yearStart, yearEnd) => {
    return axios.get(searchEndpoint(q, locations, yearStart, yearEnd));
  },
  findAsset: (nasa_id) => {
    return axios.get(assetEndpoint(nasa_id));
  },
  getMetaData: (nasa_id) => {
    return axios.get(metaDataEndpoint(nasa_id));
  },
  getCaption: (nasa_id) => {
    return axios.get(captionsEndpoint(nasa_id));
  }
}