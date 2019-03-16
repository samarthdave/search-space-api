import axios from 'axios';

const APIURL = 'https://images-api.nasa.gov';
const searchEndpoint = (q) => `${APIURL}/search?q=${q}`;
const assetEndpoint = (nasa_id) => `${APIURL}/asset/${nasa_id}`;
const metaDataEndpoint = (nasa_id) => `${APIURL}/metadata/${nasa_id}`;
const captionsEndpoint = (nasa_id) => `${APIURL}/captions/${nasa_id}`;

export const search = async (query) => {
  return axios.get(searchEndpoint(query));
};