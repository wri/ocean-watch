import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// components
import Spinner from 'components/ui/Spinner';

// hooks
import useCountryList from 'hooks/country/country-list';

const CountrySelector = ({ onClickCountry }) => {
  const searchBoxRef = useRef(null);
  const [search, setSearch] = useState('');

  const handleCountry = useCallback(
    ({ target }) => {
      const {
        dataset: { geostore, name },
      } = target;
      onClickCountry({ name, geostore });
    },
    [onClickCountry],
  );
  const {
    data: countries,
    isFetching,
    isSuccess,
    isInitialData,
  } = useCountryList({
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const countryList = useMemo(
    () =>
      countries
        .filter(({ name }) => !!name)
        .map(({ name, geostoreId }) => ({
          name,
          geostoreId,
        })),
    [countries],
  );

  const results = useMemo(
    () =>
      countryList.filter(({ name }) =>
        name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      ),
    [countryList, search],
  );

  useEffect(() => {
    if (searchBoxRef.current) searchBoxRef.current.focus();
  }, []);

  return (
    <div className="c-country-search-selector">
      <div className="countries-container">
        {isInitialData && isFetching && <Spinner isLoading className="-small -transparent" />}
        {isSuccess && (
          <ul className="country-list">
            {results.map(({ name, geostoreId }) => (
              <li key={geostoreId} className="country-list-item">
                <button
                  type="button"
                  onClick={handleCountry}
                  data-geostore={geostoreId}
                  data-name={name}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

CountrySelector.propTypes = {
  onClickCountry: PropTypes.func.isRequired,
};

export default CountrySelector;
