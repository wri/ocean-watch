import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import Header from 'layout/header';
import OceanWatchHero from 'layout/layout/ocean-watch/hero';
import OceanWatchPartners from 'layout/layout/ocean-watch/partners';
import MapSelection from 'layout/layout/ocean-watch/map/component';
import Banner from 'components/app/common/Banner';

// services
import { fetchConfigFile, fetchOceanWatchAreas } from 'services/ocean-watch';

const OceanWatchStoryTelling = dynamic(() => import('../layout/layout/ocean-watch/storytelling'), {
  ssr: false,
});

export default function OceanWatchIntroPage({ geostore, oceanWatchConfig }) {
  return (
    <LayoutOceanWatch
      title="Ocean Watch – Introduction"
      description="Ocean Watch description" // todo: replace description
      isExtendedHero
    >
      <div
        className="hero-extended-background"
        style={{
          position: 'relative',
          padding: '0 0 150px',
        }}
      >
        <Header className="-transparent" />
        <OceanWatchHero className="-transparent" />

        <div className="l-container">
          <section className="l-section -small">
            <div className="row">
              <div className="column small-12 medium-8">
                <p className="text-white">
                  Welcome to the Beta version of Ocean Watch! We are still tweaking things and
                  making improvements. Please use the feedback button on the right to let us know if
                  there is anything we can change to make your experience better!
                </p>
                <p className="text-white">
                  The ocean and humanity are connected. To ensure the health and economic vitality
                  of ocean ecosystems, ocean management needs an upgrade. Ocean Watch provides the
                  data and information policymakers need to make better-informed decisions about
                  sustainable ocean management.
                </p>
              </div>
            </div>
          </section>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            display: 'inline-block',
            width: '100%',
            height: 200,
            background: 'linear-gradient(to bottom, transparent, #0F4573)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        style={{
          background: '#0F4573',
          margin: '-85px 0 0',
        }}
        id="intro-content"
      >
        <OceanWatchStoryTelling
          indicators={oceanWatchConfig.intro.indicators}
          steps={oceanWatchConfig.intro.steps}
          geostore={geostore}
        />

        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div
                id="countries-selection"
                style={{
                  padding: '25px 0 175px',
                }}
              >
                <MapSelection />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            transform: 'translate(0, calc(-265px / 2))',
            margin: '0 0 calc(-265px / 2)',
          }}
        >
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <Banner
                  useDim
                  className="h-full !p-10 md:!p-16"
                  bgImage="/static/images/pages/app/banner-coral.jpg"
                >
                  <div className="flex flex-col h-full md:items-center">
                    <h4 className="text-lg font-light text-center text-white md:text-xl md:leading-10 ">
                      Check out the Coral Reefs dashboards
                    </h4>
                    <Link href="/dashboards/coral-reef-dashboards">
                      <a className="c-button -alt -primary">Coral Reefs</a>
                    </Link>
                  </div>
                </Banner>
              </div>
              <div
                className="column small-12"
                style={{
                  margin: '20px 0 0',
                }}
              >
                <Banner
                  useDim
                  className="!p-10 text-center"
                  bgImage="/static/images/pages/app/banner-ocean-watch.jpg"
                >
                  <h4 className="m-0 text-lg font-light text-white md:leading-10 md:text-xl">
                    View Ocean Watch Data
                    <br />
                    on WRI Data Explorer
                  </h4>
                  <Link href="https://datasets.wri.org/dataset?q=Ocean">
                    <a className="w-full mt-4 c-button -alt -primary md:w-auto">Explore</a>
                  </Link>
                </Banner>
              </div>
            </div>
          </div>
          <section className="l-section -medium">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <OceanWatchPartners />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </LayoutOceanWatch>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  // prefetch areas
  await queryClient.prefetchQuery('ocean-watch-areas', fetchOceanWatchAreas);

  // prefetch Ocean Watch config file
  await queryClient.prefetchQuery('ocean-watch-config-file', fetchConfigFile);

  // this page always uses a worldwide geostore
  const { geostore } =
    queryClient.getQueryData('ocean-watch-areas').find(({ iso }) => iso === 'GLB') || {};

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      geostore,
      oceanWatchConfig: queryClient.getQueryData('ocean-watch-config-file'),
    },
  };
}

OceanWatchIntroPage.defaultProps = {
  geostore: null,
};

OceanWatchIntroPage.propTypes = {
  geostore: PropTypes.string,
  oceanWatchConfig: PropTypes.shape({
    intro: PropTypes.shape({
      steps: PropTypes.arrayOf(PropTypes.shape({})),
      indicators: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired,
  }).isRequired,
};
