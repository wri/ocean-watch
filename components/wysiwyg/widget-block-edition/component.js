import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Tabs from 'components/ui/Tabs';

class WidgetBlockEdition extends PureComponent {
  static propTypes = {
    onChangeTab: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearch: PropTypes.func.isRequired,
    onSelectWidget: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    widgets: PropTypes.array.isRequired,
  };

  render() {
    const { tab, onChangeTab } = this.props;

    return (
      <div className="c-dashboard-widget-edition">
        <div className="l-page">
          <div className="c-page-header -admin">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <div className="page-header-content -with-tabs">
                    <h1>Select visualization</h1>
                    <Tabs
                      options={[
                        { label: 'My visualizations', value: 'my-widgets' },
                        { label: 'My favorites', value: 'my-favorites' },
                        { label: 'All visualizations', value: 'all-widgets' },
                      ]}
                      defaultSelected={tab}
                      selected={tab}
                      onChange={onChangeTab}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetBlockEdition;
