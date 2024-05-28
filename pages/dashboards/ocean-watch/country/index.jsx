import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { useMediaMatch } from 'rooks';

// hooks
import { useOceanWatchAreas } from 'hooks/ocean-watch';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import Header from 'layout/header';
import OceanWatchPartners from 'layout/layout/ocean-watch/partners';
import Modal from 'components/modal/modal-component';

export default function OceanWatchCountryProfiles() {
  const router = useRouter();
  const [countryValue, setCountryValue] = useState();
  const [isModalVisible, setModalVisibility] = useState(false);

  const { data: areas } = useOceanWatchAreas({
    select: (_areas) =>
      _areas
        .filter(({ iso }) => iso !== 'GLB')
        .map(({ name: label, iso: value }) => ({
          label,
          value,
        })),
  });

  const handleAreaChange = useCallback(
    ({ value }) => {
      setCountryValue(value);
      router.push({
        pathname: '/dashboards/ocean-watch/country/[iso]',
        query: {
          iso: value,
        },
      });
    },
    [router],
  );

  const onCloseModal = useCallback(() => {
    setModalVisibility((modalVisibility) => !modalVisibility);
  }, []);

  const shouldWarningModalRender = useMediaMatch('(max-width: 768px)');

  useEffect(() => {
    if (shouldWarningModalRender) setModalVisibility(shouldWarningModalRender);
  }, [shouldWarningModalRender]);

  return (
    <LayoutOceanWatch
      title="Ocean Watch – Country Profiles Index"
      description="Ocean Watch description" // todo: replace description
    >
      <Header className="-transparent" />
      <section className="l-section -secondary -small">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <Select
                instanceId="area-selector"
                options={areas}
                className="-large"
                onChange={handleAreaChange}
                clearable={false}
                value={countryValue}
                placeholder="Select a country"
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 550,
                  width: '100%',
                  margin: '25px 0 0',
                  background: 'url(/static/images/ocean-watch/placeholder-map.png)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <h3
                  style={{
                    color: '#393f44',
                    fontSize: 26,
                    fontWeight: 300,
                    textAlign: 'center',
                  }}
                >
                  Select a coastline country to further explore <br />
                  land-based pressures upon the ocean.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="l-section -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <OceanWatchPartners />
            </div>
          </div>
        </div>
      </section>
      <Modal isOpen={isModalVisible} onRequestClose={onCloseModal}>
        <p>
          The mobile version has limited functionality, please check the desktop version to have
          access to the full list of features available on the Ocean Watch dashboard.
        </p>
      </Modal>
    </LayoutOceanWatch>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
