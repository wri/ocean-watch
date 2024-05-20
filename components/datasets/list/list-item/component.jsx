import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// components
import WidgetChart from 'components/charts/widget-chart';
import MapThumbnail from 'components/map/thumbnail';
import PlaceholderChart from 'components/charts/placeholder-chart';
import ForwardLink from 'components/forward-link';

// utils
import { getDateConsideringTimeZone } from 'utils/utils';

// lib
import { Media } from 'lib/media';

const DatasetListItem = (props) => {
  const { dataset, widget, layer, mode, user, actions, tags, metadata } = props;
  const renderChart = useCallback(() => {
    const isWidgetMap = widget && widget.widgetConfig.type === 'map';
    const isEmbedWidget = widget && widget.widgetConfig.type === 'embed';

    if (mode !== 'grid') return null;

    if (widget && !isWidgetMap && !isEmbedWidget) {
      return (
        <div className="list-item-chart">
          <WidgetChart widget={widget} thumbnail />
        </div>
      );
    }

    if (layer || isWidgetMap) {
      return (
        <div className="list-item-chart">
          <MapThumbnail layer={layer} />
        </div>
      );
    }

    return (
      <div className="list-item-chart">
        <Link href={`/data/explore/${dataset.slug}`} passHref>
          <ForwardLink>
            <PlaceholderChart />
          </ForwardLink>
        </Link>
      </div>
    );
  }, [mode, widget, layer, dataset]);

  const dateLastUpdated = getDateConsideringTimeZone(dataset.dataLastUpdated);

  return (
    <div className={`c-dataset-list-item -${mode}`}>
      {/* CHART */}
      <Media greaterThanOrEqual="md">{renderChart()}</Media>

      {/* CHART MOBILE */}
      <Media at="sm">
        <Link href={`/data/explore/${dataset.slug}`}>{renderChart()}</Link>
      </Media>

      {/* INFO */}
      <div className="info">
        <div className="detail">
          {/* Title */}
          <div className="title-container">
            <h4>
              <Link href={`/data/explore/${dataset.slug}`} passHref>
                <ForwardLink>
                  {(metadata && metadata.info && metadata.info.name) || dataset.name}
                </ForwardLink>
              </Link>
            </h4>
          </div>

          {/* Source */}
          <div className="metadata-container">
            {metadata && metadata.source && (
              <p>
                Source: &nbsp;
                {metadata.source}
              </p>
            )}
          </div>

          {/* Last update */}
          <div className="last-update-container">
            {dateLastUpdated && (
              <p>
                Last update: &nbsp;
                {dateLastUpdated}
              </p>
            )}
          </div>

          {!!tags && React.cloneElement(tags, { ...props })}
        </div>

        {!!actions && React.cloneElement(actions, { ...props })}
      </div>
    </div>
  );
};

DatasetListItem.defaultProps = {
  mode: 'grid',
  widget: null,
  layer: null,
  metadata: null,
  tags: null,
  actions: null,
};

DatasetListItem.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    dataLastUpdated: PropTypes.string,
  }).isRequired,
  widget: PropTypes.shape({
    widgetConfig: PropTypes.shape({
      type: PropTypes.string,
    }),
  }),
  layer: PropTypes.shape({}),
  metadata: PropTypes.shape({
    source: PropTypes.string,
    info: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  mode: PropTypes.string,
  user: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
  tags: PropTypes.node,
  actions: PropTypes.node,
};

export default DatasetListItem;
