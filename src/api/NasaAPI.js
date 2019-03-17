import axios from 'axios';

const APIURL = 'https://images-api.nasa.gov';
const searchEndpoint = (q) => `${APIURL}/search?q=${q}`;
const assetEndpoint = (nasa_id) => `${APIURL}/asset/${nasa_id}`;
const metaDataEndpoint = (nasa_id) => `${APIURL}/metadata/${nasa_id}`;
const captionsEndpoint = (nasa_id) => `${APIURL}/captions/${nasa_id}`;

// return a promise on each with axios so "await" is supported
export default {
  search: (query) => {
    return axios.get(searchEndpoint(query));
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