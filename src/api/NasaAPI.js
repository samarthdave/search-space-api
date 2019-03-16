import axios from 'axios';

const APIURL = 'https://images-api.nasa.gov';
const searchEndpoint = (q) => `${APIURL}/search?q=${q}`;
const assetEndpoint = (nasa_id) => `${APIURL}/asset/${nasa_id}`;
const metaDataEndpoint = (nasa_id) => `${APIURL}/metadata/${nasa_id}`;
const captionsEndpoint = (nasa_id) => `${APIURL}/captions/${nasa_id}`;

export default {
  search: async (query) => {
    return axios.get(searchEndpoint(query));
  },
  findAsset: async (nasa_id) => {
    return axios.get(assetEndpoint(nasa_id));
  },
  getMetaData: async (nasa_id) => {
    return axios.get(metaDataEndpoint(nasa_id));
  },
  getCaption: async (nasa_id) => {
    return axios.get(captionsEndpoint(nasa_id));
  }
}