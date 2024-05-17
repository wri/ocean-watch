import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// utils
import { getRWAdapter } from 'utils/widget-editor';

// component
import CardIndicatorSet from './component';

export default function CardIndicatorSetContainer({ config: { indicators }, ...restProps }) {
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  const defaultIndicator = useMemo(
    () => indicators.find(({ default: isDefault }) => isDefault) || indicators?.[0],
    [indicators],
  );
  const [currentIndicator, setIndicator] = useState(defaultIndicator || null);
  const handleClickCard = useCallback(
    (idSelected) => {
      setIndicator(indicators.find(({ id }) => idSelected === id));
    },
    [indicators],
  );

  return (
    <CardIndicatorSet
      {...restProps}
      RWAdapter={RWAdapter}
      indicator={currentIndicator}
      handleClickCard={handleClickCard}
    />
  );
}

CardIndicatorSetContainer.propTypes = {
  config: PropTypes.shape({
    indicators: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};
