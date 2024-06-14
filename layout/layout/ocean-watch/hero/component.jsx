import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

export default function OceanWatchHero({ className }) {
  const [shareVisible, setShareVisibility] = useState(false);

  return (
    <section className={classnames('l-page-header', { [className]: !!className })}>
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <div
              style={{
                padding: '30px 0 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  'flex-direction': 'row-reverse',
                }}
              >
                <button
                  type="button"
                  className="c-btn -tertiary -alt -clean"
                  onClick={() => setShareVisibility(true)}
                >
                  <Icon name="icon-share" className="-small" />
                  <span>Share</span>
                </button>
              </div>
              <h1 className="mb-2 page-header-title md:mb-8">Ocean Watch <sup>Beta</sup></h1>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={shareVisible}
        className="-medium"
        onRequestClose={() => setShareVisibility(false)}
      >
        <ShareModal
          links={{
            link: typeof window !== 'undefined' && window.location.href,
          }}
        />
      </Modal>
    </section>
  );
}

OceanWatchHero.defaultProps = {
  className: null,
};

OceanWatchHero.propTypes = {
  className: PropTypes.string,
};
