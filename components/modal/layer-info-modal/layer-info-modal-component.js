import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { fetchDataset } from 'services/dataset';

function LayerInfoModal(props) {
  const { layer } = props;
  const [slug, setSlug] = useState(' ');

  useEffect(() => {
    fetchDataset(layer.dataset).then((dataset) => {
      setSlug(dataset.slug);
    });
  }, [layer.dataset]);

  return (
    <div className="c-layer-info-modal">
      <div className="layer-info-content">
        <h2>{layer.name}</h2>
        <div className="c-markdown">
          <ReactMarkdown linkTarget="_blank" source={layer.description} />
        </div>
        <div className="c-button-container -j-end">
          <button
            className="c-btn -primary"
            onClick={() => {
              const url = new URL('https://resourcewatch.org');
              url.pathname = `/data/explore/${slug}`;

              window.open(url.toString(), '_blank', 'noopener,noreferrer');

              if (props.onRequestClose) {
                props.onRequestClose();
              }
            }}
          >
            More info
          </button>
        </div>
      </div>
    </div>
  );
}

LayerInfoModal.propTypes = {
  layer: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default LayerInfoModal;
