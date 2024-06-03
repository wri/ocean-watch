import { useCallback, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';

// components
import WidgetChart from 'components/charts/widget-chart';
import MapThumbnail from 'components/map/thumbnail';
import PlaceholderChart from 'components/charts/placeholder-chart';

// Utils
import { getDateConsideringTimeZone } from 'utils/utils';

// lib
import { Media } from 'lib/media';

export default function DatasetCardItem(props) {
  const { dataset, widget, layer, metadata, actions, expandedChart } = props;
  const dateLastUpdated = getDateConsideringTimeZone(dataset.dataLastUpdated, true);

  const renderChart = useCallback(() => {
    const isWidgetMap = widget && widget.widgetConfig.type === 'map';
    const isEmbedWidget = widget && widget.widgetConfig.type === 'embed';
    const classNameValue = classnames({
      'list-item-chart': true,
      '-expanded-chart': expandedChart,
    });

    if (widget && !isWidgetMap && !isEmbedWidget) {
      return (
        <div className={classNameValue}>
          <WidgetChart widget={widget} thumbnail />
        </div>
      );
    }

    if (layer || isWidgetMap) {
      return (
        <a
          href={`https://resourcewatch.org/data/explore/${dataset.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={classNameValue}>
            <MapThumbnail layer={layer} />
          </div>
        </a>
      );
    }

    return (
      <div className={classNameValue}>
        <a
          href={`https://resourcewatch.org/data/explore/${dataset.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlaceholderChart />
        </a>
      </div>
    );
  }, [widget, dataset, layer, expandedChart]);

  return (
    <div
      className={classnames({
        'c-dataset-card-item': true,
        '-active': dataset.active,
      })}
    >
      <Media greaterThanOrEqual="md">{renderChart()}</Media>

      <Media at="sm">
        <a
          href={`https://resourcewatch.org/data/explore/${dataset.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderChart()}
        </a>
      </Media>

      {/* INFO */}
      <div className="info">
        <div className="source-date">
          {/* Source */}
          <div className="source" title={metadata && metadata.source}>
            {metadata && metadata.source}
          </div>
          {/* Last update */}
          <div className="date">{dateLastUpdated}</div>
        </div>

        {/* Title */}
        <div className="title-actions">
          <h4>
            <a
              href={`https://resourcewatch.org/data/explore/${dataset.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {(metadata && metadata.info && metadata.info.name) || dataset.name}
            </a>
          </h4>
          {actions && <Media greaterThanOrEqual="md">{cloneElement(actions, { ...props })}</Media>}
        </div>
      </div>
    </div>
  );
}
DatasetCardItem.defaultProps = {
  layer: null,
  widget: null,
  expandedChart: false,
};

DatasetCardItem.propTypes = {
  dataset: PropTypes.shape({
    active: PropTypes.bool,
    dataLastUpdated: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string.isRequired,
    hrefLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        pathname: PropTypes.string,
        query: PropTypes.shape({}),
      }),
    ]),
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
  }).isRequired,
  actions: PropTypes.node.isRequired,
  expandedChart: PropTypes.bool,
};
