import { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const MiniExploreDatasetsActions = (props) => {
  const { dataset, layer, handleAddMap } = props;

  const onHandleMap = useCallback(
    (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      handleAddMap(dataset, layer);
    },
    [handleAddMap, dataset, layer],
  );

  return (
    <div className="c-datasets-actions">
      <button
        className={classnames({
          'c-button': true,
          '-secondary': !dataset.active,
          '-primary': dataset.active,
          '-compressed': true,
          '-disable': !layer,
          '-fullwidth': true,
        })}
        type="button"
        disabled={!layer}
        onClick={onHandleMap}
      >
        {dataset.active ? 'Active' : 'Add to map'}
      </button>
    </div>
  );
};

MiniExploreDatasetsActions.defaultProps = {
  dataset: {},
  layer: {},
};

MiniExploreDatasetsActions.propTypes = {
  dataset: PropTypes.shape({
    active: PropTypes.bool,
    id: PropTypes.string,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    ),
  }),
  layer: PropTypes.shape({}),
  handleAddMap: PropTypes.func.isRequired,
};

export default MiniExploreDatasetsActions;
