import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'nuka-carousel';

const defaultSettings = {
  slidesToShow: 7,
  slidesToScroll: 7,
  dragging: true,
  autoplay: true,
  autoplayInterval: 3500,
  initialSlideHeight: 56,
  wrapAround: true,
  renderTopCenterControls: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  renderCenterLeftControls: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  renderCenterRightControls: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  renderBottomCenterControls: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
};

function Carousel({ settings = defaultSettings, items = [] }) {
  if (window.innerWidth < 720) {
    settings.slidesToShow = 2;
    settings.slidesToScroll = 2;
  }

  return (
    <div className="c-carousel">
      <Slider {...settings}>{items.map((item) => item)}</Slider>
    </div>
  );
}

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  settings: PropTypes.object,
};

export default Carousel;
