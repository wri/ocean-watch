import classnames from 'classnames';

import Icon from 'components/ui/icon';
import Title from 'components/ui/Title';

export default function WidgetHeader({
  widget,
  params = {},
  onToggleInfo,
  onToggleShare,
  isInfoVisible = false,
}) {
  const modalIcon = classnames({
    'icon-cross': isInfoVisible,
    'icon-info': !isInfoVisible,
  });

  return (
    <header className="c-widget-header">
      <div className="header-container">
        <div className="title-container">
          <Title className="-default">{widget?.name}</Title>
        </div>
        <div className="button-list">
          <ul>
            <li>
              <button type="button" className="c-btn -tertiary -clean" onClick={onToggleShare}>
                <Icon name="icon-share" className="-small" />
              </button>
            </li>
            <li>
              <button type="button" className="c-btn -clean" onClick={onToggleInfo}>
                <Icon name={modalIcon} className="-small" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
