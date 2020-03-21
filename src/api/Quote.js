const arr = require('./quotes.json');

let quote = {};
const maxValue = arr.length - 1;

function randomInt(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

export default {
  randomInt,
  getRandomQuote: () => {
    const index = randomInt(0, maxValue);
    return arr[index].text;
  },
  getQuote: () => {
    let index = randomInt(0, maxValue);
    quote.text = arr[index].text;
    quote.author = arr[index].from;
    return quote;
  }
};
