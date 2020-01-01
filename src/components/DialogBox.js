import React from 'react';
import {
  Dialog,
  Badge
} from 'evergreen-ui';

import utils from '../utils';

function DialogBox(props) {
  const {
    currentImage
  } = props;

  if(!currentImage) {
    return null;
  }

  const {
    imgURL,
    fullTitle,
    secondaryText,
    description,
    nasa_id,
    date_created,
    keywords
  } = currentImage;

  let badges = null;
  // TODO: random colors on the badges
  if(keywords) {
    const colors = utils.getBadgeColors(keywords.length);
    badges = keywords.map((word, i) => (
      <Badge isSolid color={colors[i]} marginRight={8}>{word}</Badge>
    ));
  }

  return (
    <Dialog
      {...props}
      title={fullTitle}
      width={700}
    >
      <img className="dialog-img" src={imgURL} alt={secondaryText} />
      <div className="dialog-info">
        <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text="Check out this great image I found!" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        <Badge color="green" marginRight={8}>ID: {nasa_id}</Badge>
        <br />
        {badges}
        <h4>{date_created ? new Date(date_created).toDateString() : ''}</h4>
        <div dangerouslySetInnerHTML={{ __html: description }}></div>
        {/* {description} */}
      </div>
    </Dialog>
  );
}

export default DialogBox;