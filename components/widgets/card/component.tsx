import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Tooltip } from 'vizzuality-components';
import { saveAs } from 'file-saver';
import dateFnsFormat from 'date-fns/format';
import { replace } from '@vizzuality/layer-manager-utils';

// services
import { fetchLayer } from 'services/layer';

// utils
import { isMapWidget, isEmbedWidget, isTextualWidget, getWidgetType } from 'utils/widget';
import { getLinksByWidgetType } from 'utils/embed';

// constants
import { INITIAL_STATE, REDUCER } from 'components/widgets/card/reducer';

// components
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import WidgetChart from 'components/charts/widget-chart';
import MapThumbnail from 'components/map/thumbnail';
import ShareModal from 'components/modal/share-modal';
import TextChart from 'components/widgets/charts/TextChart';
import WidgetActionsTooltip from 'components/widgets/card/tooltip';

// hooks
import { useGeostore } from 'hooks/geostore';

// types
import type { APIWidgetSpec } from 'types/widget';

export interface WidgetCardProps {
  widget: APIWidgetSpec;
  mode: 'grid' | 'list';
  showActions?: boolean;
  showEmbed?: boolean;
  showRemove?: boolean;
  showFavorite?: boolean;
  thumbnail?: boolean;
  clickable?: boolean;
  params?: Record<string, string>;
  onWidgetClick?: (widget: APIWidgetSpec) => void;
  onWidgetRemove: () => void;
  setModalOptions: (options) => void;
  toggleModal: (visibility: boolean) => void;
}

const WidgetCard = ({
  widget,
  mode,
  showActions = false,
  showEmbed = false,
  showRemove = false,
  thumbnail = false,
  clickable = false,
  params = {},
  onWidgetClick,
  toggleModal,
  setModalOptions,
}: WidgetCardProps): JSX.Element => {
  const router = useRouter();
  const [state, dispatch] = useReducer(REDUCER, INITIAL_STATE);
  const { loading, layer, error, tooltip } = state;
  const widgetType = useMemo(() => getWidgetType(widget), [widget]);

  const handleRemoveVisualization = useCallback(() => {
    const { name } = widget;

    toastr.confirm(`Are you sure you want to remove the visualization: ${name}?`, {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onOk: () => {},
    });
  }, [widget]);

  const handleEmbed = useCallback(() => {
    const options = {
      children: ShareModal,
      childrenProps: {
        links: getLinksByWidgetType(widget, params),
        toggleModal,
      },
    };

    toggleModal(true);
    setModalOptions(options);
  }, [params, widget, toggleModal, setModalOptions]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleEditWidget = useCallback(() => {}, []);

  const handleGoToDataset = useCallback(() => {
    const { dataset } = widget;

    router.push(`/data/explore/${dataset}`);
  }, [router, widget]);

  const handleDownloadPDF = useCallback(async () => {
    toastr.info('Downloading PDF...', 'This process might take a few seconds.');

    const { id } = widget;
    const { origin } = window.location;
    const destinyQueryParams = new URLSearchParams(params);
    const url = new URL(`${origin}/embed/${widgetType}/${id}`);
    const queryParams = new URLSearchParams({
      filename: widget.slug,
      width: '790',
      height: '580',
      waitFor: '8000',
    });

    const webshot = `${
      process.env.NEXT_PUBLIC_WRI_API_URL
    }/v1/webshot?${queryParams.toString()}&url=${encodeURIComponent(
      `${url}?${destinyQueryParams}`,
    )}`;

    toggleModal(false);
    saveAs(webshot, `${widget.slug}-${dateFnsFormat(Date.now(), "yyyy-MM-dd'T'HH:mm:ss")}.pdf`);
  }, [widget, params, widgetType, toggleModal]);

  const handleTooltipVisibility = useCallback((visible) => {
    dispatch({ type: 'WIDGET-CARD/SET_TOOLTIP', payload: visible });
  }, []);

  const getLayer = async (layerId) => {
    dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: true });
    dispatch({ type: 'WIDGET-CARD/SET_ERROR', payload: null });

    try {
      const layerData = await fetchLayer(layerId);
      dispatch({ type: 'WIDGET-CARD/SET_LAYER', payload: layerData });
      dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: false });
    } catch (e) {
      dispatch({
        type: 'WIDGET-CARD/SET_ERROR',
        payload: 'There was an issue rendering the visualization',
      });
      dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: false });
    }
  };

  const getWidgetPreview = () => {
    if (loading) {
      return <Spinner className="-light" isLoading />;
    }

    if (error || !widget) {
      return (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray">Preview not available</span>
        </div>
      );
    }

    // If the widget is an embedded page, we render a
    // different component
    if (isEmbedWidget(widget.widgetConfig)) {
      if (mode === 'grid') {
        return (
          <div className="c-widget-chart -thumbnail">
            <div className="c-we-chart -no-preview">
              <span>No preview</span>
            </div>
          </div>
        );
      }

      return (
        <div className="c-widget-chart -embed">
          <iframe
            title={widget.name}
            src={widget.widgetConfig.paramsConfig.embed.src}
            frameBorder="0"
          />
        </div>
      );
    }

    if (isMapWidget(widget.widgetConfig)) {
      return <MapThumbnail layer={layer} />;
    }

    // If the widget is a textual one, it's rendered differently
    if (isTextualWidget(widget.widgetConfig)) {
      return (
        <div className={`c-widget-chart -${mode}`}>
          <TextChart widgetConfig={widget.widgetConfig} />
        </div>
      );
    }

    // We render a Vega chart
    return <WidgetChart widget={widget} thumbnail={thumbnail} />;
  };

  useEffect(() => {
    if (isMapWidget(widget.widgetConfig)) {
      const layerId =
        (widget.widgetConfig.paramsConfig && widget.widgetConfig.paramsConfig.layer) ||
        widget.widgetConfig.layer_id;

      getLayer(layerId);
    }
  }, [widget]);

  const widgetLinks = useMemo(() => widget?.metadata?.[0]?.info?.widgetLinks || [], [widget]);
  const isWidgetOwner = false;

  const { data: geostoreProperties } = useGeostore(
    params?.geostore_id || params?.aoi,
    {},
    {
      enabled: Boolean(params?.geostore_id || params?.aoi),
      select: (geostore) => {
        if (!geostore) return {};
        return geostore.geojson.features[0].properties || {};
      },
      placeholderData: null,
    },
  );

  const widgetName = useMemo(() => {
    if (!geostoreProperties) return widget.name;
    return replace(widget.name, geostoreProperties);
  }, [widget, geostoreProperties]);

  return (
    <div
      className={classnames({
        'c-widget-card': true,
        '-clickable': clickable,
      })}
      {...(clickable && {
        tabIndex: -1,
        role: 'button',
        onClick: () => onWidgetClick && onWidgetClick(widget),
      })}
    >
      <div className="widget-preview">{getWidgetPreview()}</div>
      <div className="info">
        <div className="detail">
          <Title className="-default -primary line-clamp-3">{widgetName}</Title>
          <p className="line-clamp-4">{widget.description}</p>
        </div>

        {(showActions || showRemove || showEmbed) && (
          <div className="actions">
            {showActions && (
              <Tooltip
                visible={tooltip}
                overlayClassName="c-rc-tooltip -default -no-max-width"
                placement="top"
                destroyTooltipOnHide
                overlay={
                  <WidgetActionsTooltip
                    toggleTooltip={() => {
                      handleTooltipVisibility(false);
                    }}
                    onShareEmbed={handleEmbed}
                    onGoToDataset={handleGoToDataset}
                    onEditWidget={handleEditWidget}
                    onDownloadPDF={handleDownloadPDF}
                    onRemove={handleRemoveVisualization}
                    widgetLinks={widgetLinks}
                    isWidgetOwner={isWidgetOwner}
                  />
                }
              >
                <button
                  className="c-button -secondary widget-actions"
                  onClick={() => {
                    handleTooltipVisibility(!tooltip);
                  }}
                >
                  Options
                </button>
              </Tooltip>
            )}
            <button type="button" className="c-button" onClick={handleEditWidget}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetCard;
