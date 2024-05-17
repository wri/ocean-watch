import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// utils
import { getParametrizedWidget } from 'utils/widget';

// types
import { Adapter } from '@widget-editor/types';
import type { APIWidgetSpec } from 'types/widget';

// component
import WidgetItem from './component';

export default function WidgetItemContainer({
  widgetId,
  params,
  adapter,
}: {
  widgetId: string;
  params: Record<string, string | number>;
  adapter: Adapter.Service;
}): JSX.Element {
  const [isShareVisible, setShareVisibility] = useState(false);
  const { isInACollection } = useBelongsToCollection();

  const widgetState = useFetchWidget(
    widgetId,
    {
      includes: 'metadata',
    },
    {
      enabled: !!widgetId,
      refetchOnWindowFocus: false,
      placeholderData: {},
      select: (_widget) => getParametrizedWidget(_widget as APIWidgetSpec, params),
    },
  );

  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareWidget = useCallback(() => {
    setShareVisibility(true);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setShareVisibility(false);
  }, []);

  return (
    <WidgetItem
      adapter={adapter}
      widgetState={widgetState}
      params={params}
      isInACollection={isInACollection}
      isInfoVisible={isInfoWidgetVisible}
      isShareVisible={isShareVisible}
      handleInfoToggle={handleInfoToggle}
      handleShareToggle={handleShareWidget}
      handleCloseShareWidget={handleCloseShareWidget}
    />
  );
}

WidgetItemContainer.defaultProps = {
  params: {},
};

WidgetItemContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
  adapter: PropTypes.func.isRequired,
};
