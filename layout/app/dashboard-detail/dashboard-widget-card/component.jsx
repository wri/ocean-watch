import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Renderer from '@widget-editor/renderer';

// components
import TextChart from 'components/widgets/charts/TextChart';
import Icon from 'components/ui/icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import ErrorBoundary from 'components/ui/error-boundary';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import RankingWidget from 'layout/app/dashboard-detail/dashboard-widget-card/ranking-widget';

// constants
import { WIDGET_EDITOR_MAPBOX_PROPS } from 'constants/widget-editor';

function DashboardWidgetCard(props) {
  const { user, widget, loading, explicitHeight, RWAdapter } = props;
  const widgetConfig = widget && widget.widgetConfig;
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [infoCardOpen, setInfoCardOpen] = useState(false);
  const widgetType = widget && widget.type;
  const metadataInfo =
    (widget && widget.metadata && widget.metadata.length > 0 && widget.metadata[0].info) || {};

  const widgetLinks = metadataInfo.widgetLinks || [];
  const { caption } = metadataInfo;
  const widgetIsEmbed = widgetConfig && widgetConfig.type === 'embed';
  const widgetIsRanking = widgetConfig && widgetConfig.type === 'ranking';
  const widgetIsMap = widgetConfig && widgetConfig.type === 'map';
  const widgetEmbedUrl = widgetIsEmbed && widgetConfig.url;

  const modalIcon = classnames({
    'icon-cross': infoCardOpen,
    'icon-info': !infoCardOpen,
  });

  const classNameValue = classnames({
    'c-dashboard-widget-card': true,
    '-embed-widget': widgetIsEmbed,
    '-map': widgetIsMap,
  });

  const classNameWidgetContainer = classnames({
    'widget-container': true,
    '-full-height': widgetIsEmbed,
  });

  return (
    <div className={classNameValue}>
      <header>
        <div className="header-container">
          <Title className="-default">{widget ? widget.name : '–'}</Title>
          <div className="buttons">
            <ul>
              <li>
                <button className="c-btn -tertiary -clean" onClick={() => setShareModalOpen(true)}>
                  <Icon name="icon-share" className="-small" />
                </button>

                <Modal
                  isOpen={shareModalOpen}
                  className="-medium"
                  onRequestClose={() => setShareModalOpen(false)}
                >
                  <ShareModal
                    links={{
                      link:
                        typeof window !== 'undefined' &&
                        widget &&
                        `${window.location.origin}/embed/${widgetType}/${widget.id}`,
                      embed:
                        typeof window !== 'undefined' &&
                        widget &&
                        `${window.location.origin}/embed/${widgetType}/${widget.id}`,
                    }}
                  />
                </Modal>
              </li>

              <li>
              </li>
              <li>
                <button type="button" onClick={() => setInfoCardOpen(!infoCardOpen)}>
                  <Icon name={modalIcon} className="-small" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <ErrorBoundary message="There was an error loading the visualization">
        <div className={classNameWidgetContainer}>
          <Spinner isLoading={loading} className="-light -small" />
          {widgetType === 'text' && widget && <TextChart widgetConfig={widgetConfig} />}

          {widgetType === 'widget' && !widgetIsEmbed && !widgetIsRanking && (
            <Renderer
              adapter={RWAdapter}
              widgetConfig={widgetConfig}
              map={WIDGET_EDITOR_MAPBOX_PROPS}
            />
          )}

          {widgetIsEmbed && (
            <iframe
              title={widget.name}
              src={widgetEmbedUrl}
              width="100%"
              height={explicitHeight ? `${explicitHeight}px` : '100%'}
              frameBorder="0"
            />
          )}

          {widgetIsRanking && <RankingWidget widgetConfig={widgetConfig} />}

          {infoCardOpen && (
            <div className="widget-modal">
              {widget && !widget.description && <p>No additional information is available</p>}

              {widget && widget.description && (
                <div>
                  <h4>Description</h4>
                  <p>{widget.description}</p>
                </div>
              )}

              {widgetLinks.length > 0 && (
                <div className="widget-links-container">
                  <h4>Links</h4>
                  <ul>
                    {widgetLinks.map((link) => (
                      <li key={link.link}>
                        <a href={link.link} target="_blank" rel="noopener noreferrer">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        {caption && <div className="caption-container">{caption}</div>}
      </ErrorBoundary>
    </div>
  );
}

DashboardWidgetCard.defaultProps = {
  loading: false,
  explicitHeight: null,
};

DashboardWidgetCard.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    widgetConfig: PropTypes.shape({}).isRequired,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          caption: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  loading: PropTypes.bool,
  explicitHeight: PropTypes.number,
  RWAdapter: PropTypes.func.isRequired,
};

export default DashboardWidgetCard;
