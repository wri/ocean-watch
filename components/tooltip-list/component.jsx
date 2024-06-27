import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function TooltipList({ list, onClickItem }) {
  const [search] = useState('');
  const searchBoxRef = useRef(null);

  const handleCountry = useCallback(
    ({ target }) => {
      const { label, value } = target.dataset;
      onClickItem({
        label,
        value,
      });
    },
    [onClickItem],
  );

  const results = useMemo(
    () =>
      list.filter(({ label }) => label.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
    [list, search],
  );

  useEffect(() => {
    if (searchBoxRef.current) searchBoxRef.current.focus();
  }, []);

  return (
    <div className="c-tooltip-list">
      <div className="list-container before:from-white before:bg-gradient-to-b after:from-white after:bg-gradient-to-t">
        <ul className="list">
          {results.map(({ label, value }) => (
            <li key={value} className="list-item">
              <button type="button" onClick={handleCountry} data-label={label} data-value={value}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

TooltipList.defaultProps = {
  placeholder: 'Search',
};

TooltipList.propTypes = {
  onClickItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  placeholder: PropTypes.string,
};
