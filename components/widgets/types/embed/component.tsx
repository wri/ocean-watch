import { useState, useMemo, useCallback } from 'react';
import classnames from 'classnames';

import Spinner from 'components/ui/Spinner';
import WidgetHeader from 'components/widgets/header';
import WidgetInfo from 'components/widgets/info';
import WidgetCaption from 'components/widgets/caption';

import type { APIWidgetSpec } from 'types/widget';

export interface EmbedTypeWidgetProps {
  widget: APIWidgetSpec;
  isFetching: boolean;
  isInACollection: boolean;
  iframeProps?: Partial<HTMLIFrameElement>;
  onToggleShare: (widget: APIWidgetSpec) => void;
}

const EmbedTypeWidget = ({
  widget,
  isFetching,
  onToggleShare,
}: EmbedTypeWidgetProps): JSX.Element => {
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareToggle = useCallback(() => {
    onToggleShare(widget);
  }, [onToggleShare, widget]);

  const caption = useMemo(() => widget?.metadata?.[0]?.info?.caption, [widget]);

  return (
    <>
      {isFetching && <Spinner isLoading className="-transparent" />}
      {!isFetching && (
        <>
          <div className="p-4 border border-b-0 rounded-tl rounded-tr widget-header-container border-gray-light">
            <WidgetHeader
              widget={widget}
              onToggleInfo={handleInfoToggle}
              onToggleShare={handleShareToggle}
              isInfoVisible={isInfoWidgetVisible}
            />
          </div>
          <div
            className={classnames(
              'relative flex h-full overflow-x-auto overflow-y-hidden widget-container grow',
              {
                'border-0': !isInfoWidgetVisible,
                'border border-gray-light': isInfoWidgetVisible,
                'rounded-none': caption,
              },
            )}
            style={{
              height: 400,
            }}
          >
            {isInfoWidgetVisible && widget && !isFetching && (
              <WidgetInfo widget={widget} className="p-4" />
            )}
            <iframe
              title={`${widget.name} || Resource Watch`}
              src={widget.widgetConfig.url}
              width="100%"
              height="100%"
              frameBorder={0}
            />
          </div>
          {caption && <WidgetCaption text={caption} />}
        </>
      )}
    </>
  );
};

export default EmbedTypeWidget;
