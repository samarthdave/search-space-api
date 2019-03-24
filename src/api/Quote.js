const arr = require('./quotes.json');

let quote={};

function randomInt(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

export default {
  getRandomQuote: () => {
    let index = randomInt(0,23);
    return arr[index].text;
  },
  getQuote: (name) => {
    let index = randomInt(0,23);
    quote.text = arr[index].text;
    quote.author = arr[index].from;
    return quote;
  }
};
