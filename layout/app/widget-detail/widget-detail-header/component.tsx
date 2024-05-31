import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { replace } from '@vizzuality/layer-manager-utils';

// components
import Icon from 'components/ui/icon';

// types
import type { APIWidgetSpec } from 'types/widget';

const WidgetShareModal = dynamic(() => import('../../../../components/widgets/share-modal'), {
  ssr: false,
});

const WidgetDetailHeader = ({
  widget,
  params = {},
}: {
  widget: APIWidgetSpec;
  params: Record<string, string | number>;
}) => {
  const [shareModalVisibility, setShareModalVisibility] = useState(false);
  const isInACollection = false;

  const handleOpenShareModal = useCallback(() => {
    setShareModalVisibility(true);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setShareModalVisibility(false);
  }, []);

  return (
    <>
      <div className="page-header-content">
        <h1>{replace(widget.name, params)}</h1>
        <h3>{widget.description}</h3>
        <ul className="flex">
          <li className="ml-5 first:m-0">
            <button
              type="button"
              className="c-btn -tertiary -alt -clean"
              onClick={handleOpenShareModal}
            >
              <Icon name="icon-share" className="-small fill-white" />
              <span className="text-white">Share</span>
            </button>
          </li>
        </ul>
      </div>
      {shareModalVisibility && (
        <WidgetShareModal
          isVisible
          widget={widget}
          onClose={handleCloseShareWidget}
          params={params}
        />
      )}
    </>
  );
};

export default WidgetDetailHeader;
