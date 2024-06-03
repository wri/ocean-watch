import { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import classnames from 'classnames';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import Sticky from 'react-stickynode';
import { Link as ScrollLink } from 'react-scroll';
import flattenDeep from 'lodash/flattenDeep';
import { useMediaMatch } from 'rooks';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import Header from 'layout/header';
import OceanWatchPartners from 'layout/layout/ocean-watch/partners';
import InView from 'components/in-view';
import MiniExplore from 'components/mini-explore';
import MiniExploreWidgets from 'components/mini-explore-widgets';
import CardIndicatorSet from 'components/card-indicator-set';
import CardIndicator from 'components/card-indicator-set/card-indicator';
import NumericCardIndicator from 'components/card-indicator-set/numeric-card-indicator';
import MapWidget from 'components/widgets/types/map';
import SwipeMapWidget from 'components/widgets/types/map-swipe';
import ChartWidget from 'components/widgets/types/chart';
import Banner from 'components/app/common/Banner';
import Modal from 'components/modal/modal-component';

// hooks
import { useOceanWatchAreas } from 'hooks/ocean-watch';
import { useGeostore } from 'hooks/geostore';

// services
import { fetchConfigFile, fetchOceanWatchAreas } from 'services/ocean-watch';

// utils
import { getRWAdapter } from 'utils/widget-editor';

const WidgetShareModal = dynamic(() => import('components/widgets/share-modal'), {
  ssr: false,
});

export default function OceanWatchCountryProfilePage({ iso }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const shouldWarningModalRender = useMediaMatch('(max-width: 768px)');
  const [widgetToShare, setWidgetToShare] = useState(null);
  const [isModalVisible, setModalVisibility] = useState(false);
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  const handleAreaChange = useCallback(
    ({ value }) => {
      router.push({
        pathname: '/country/[iso]',
        query: {
          iso: value,
        },
      });
    },
    [router],
  );

  const handleShareWidget = useCallback((_widget) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
  }, []);

  const { data: areas } = useOceanWatchAreas({
    placeholderData: queryClient.getQueryData('ocean-watch-areas') || [],
    select: (_areas) => _areas.filter(({ iso }) => iso !== 'GLB'),
  });

  const { data: oceanWatchConfig } = useQuery(
    ['ocean-watch-config-file'],
    () => fetchConfigFile(),
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        intro: [],
        'country-profile': [],
      },
      initialStale: true,
    },
  );

  const serializedConfiguration = useMemo(
    () =>
      oceanWatchConfig['country-profile'].map((rowContent) => {
        const rowId = uuidv4();

        return [
          ...rowContent.map((blockContent) => ({
            ...blockContent,
            id: uuidv4(),
            rowId,
          })),
        ];
      }),
    [oceanWatchConfig],
  );

  const indicatorSetConfiguration = useMemo(() => {
    const configuration = serializedConfiguration.find(
      (rowContent) =>
        !!rowContent.find(
          (blockContent) =>
            blockContent.content?.[0]?.[0]?.visualizationType === 'main-indicators-set',
        ),
    )?.[0];

    if (configuration) {
      const { content, ...restConfiguration } = configuration;

      return {
        ...restConfiguration,
        ...(content && flattenDeep(content)?.[0]),
      };
    }

    return null;
  }, [serializedConfiguration]);

  const area = useMemo(() => areas.find(({ iso: areaId }) => iso === areaId), [areas, iso]);

  const { data: geostoreProperties } = useGeostore(
    area?.geostore,
    {},
    {
      enabled: Boolean(area?.geostore),
      select: (geostore) => {
        if (!geostore) return {};
        return geostore.geojson?.features[0].properties || {};
      },
      placeholderData: {},
    },
  );

  const areaOptions = useMemo(
    () =>
      areas.map(({ name: label, iso: value }) => ({
        label,
        value,
      })),
    [areas],
  );

  const defaultAreaOption = useMemo(
    () => areaOptions.find(({ value }) => iso === value),
    [areaOptions, iso],
  );

  const dashboardTabs = useMemo(
    () =>
      flattenDeep(oceanWatchConfig['country-profile'] || [])
        .filter(({ anchor }) => Boolean(anchor))
        .map(({ anchorTitle: label, anchor: value }) => ({
          label,
          value,
        })),
    [oceanWatchConfig],
  );

  const onCloseModal = useCallback(() => {
    setModalVisibility((modalVisibility) => !modalVisibility);
  }, []);

  useEffect(() => {
    if (shouldWarningModalRender) setModalVisibility(shouldWarningModalRender);
  }, [shouldWarningModalRender]);

  return (
    <LayoutOceanWatch
      title="Ocean Watch"
      description="Ocean Watch description" // todo: replace description
    >
      <Head>
        <meta name="viewport" content="width=1024" />
      </Head>
      <Header />
      <section
        className="l-section -small -secondary"
        style={{
          paddingBottom: 0,
        }}
      >
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div
                style={{
                  paddingBottom: 30,
                }}
              >
                <Select
                  instanceId="area-selector"
                  options={areaOptions}
                  className="-large"
                  onChange={handleAreaChange}
                  clearable={false}
                  value={defaultAreaOption}
                  placeholder="Select a country"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="column small-12">
              {indicatorSetConfiguration && (
                <CardIndicatorSet
                  config={indicatorSetConfiguration.config}
                  params={{
                    ...(area?.geostore && { geostore_id: area.geostore }),
                    geostore_env: 'geostore_prod',
                    ...geostoreProperties,
                  }}
                  theme={indicatorSetConfiguration.config?.theme}
                >
                  {(indicatorSetConfiguration.config?.indicators || []).map(
                    ({ id, title, icon }) => (
                      <CardIndicator
                        key={id}
                        id={id}
                        title={title}
                        icon={icon}
                        theme={indicatorSetConfiguration.config?.theme}
                      />
                    ),
                  )}
                </CardIndicatorSet>
              )}
            </div>
          </div>
        </div>
        <Sticky
          bottomBoundary="#dashboard-content"
          innerZ={10}
          className="sticky-dashboard-content-bar"
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#f4f6f7',
            }}
          >
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <ul className="dashboard-anchors-list">
                    {dashboardTabs.map(({ label, value }) => (
                      <li className="dashboard-anchors-list-item" key={value}>
                        <ScrollLink
                          activeClass="-active"
                          to={value}
                          spy
                          smooth
                          offset={-25}
                          isDynamic
                        >
                          {label}
                        </ScrollLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Sticky>
      </section>
      <div className="l-container">
        <div id="dashboard-content">
          {serializedConfiguration.map((rowContent) => (
            <div
              key={rowContent[0]?.rowId}
              {...(rowContent[0]?.anchor && { id: rowContent[0].anchor })}
            >
              {(rowContent[0]?.content || []).map((blockContent, index) => {
                if (blockContent?.[0].visualizationType === 'main-indicators-set') return null;

                return (
                  <div
                    key={index}
                    className="l-section -small"
                    style={{
                      height: '100%',
                    }}
                  >
                    <div className="row">
                      {blockContent.map((blockElement) => (
                        <div
                          key={blockContent.id}
                          className={classnames({
                            column: true,
                            'small-12': blockElement.grid === '100%',
                            'medium-6': blockElement.grid === '50%',
                          })}
                        >
                          <div
                            style={{
                              height: '100%',
                            }}
                          >
                            {blockElement.title && <h2>{blockElement.title}</h2>}
                            {blockElement.text && <p>{blockElement.text}</p>}
                            {blockElement.visualizationType === 'mini-explore' && (
                              <InView triggerOnce threshold={0.25}>
                                {({ ref, inView }) => (
                                  <div ref={ref}>
                                    {inView && (
                                      <MiniExplore
                                        config={{
                                          ...blockElement.config,
                                          ...(area?.geostore && {
                                            areaOfInterest: area.geostore,
                                          }),
                                        }}
                                      />
                                    )}
                                  </div>
                                )}
                              </InView>
                            )}
                            {blockElement.visualizationType === 'mini-explore-widgets' && (
                              <InView triggerOnce threshold={0.25}>
                                {({ ref, inView }) => (
                                  <div ref={ref}>
                                    {inView && (
                                      <MiniExploreWidgets
                                        adapter={RWAdapter}
                                        config={{
                                          ...blockElement.config,
                                          ...(area?.geostore && {
                                            areaOfInterest: area.geostore,
                                          }),
                                        }}
                                        params={{
                                          geostore_env: 'geostore_prod',
                                          ...(area?.geostore && {
                                            geostore_id: area.geostore,
                                          }),
                                          ...geostoreProperties,
                                        }}
                                      />
                                    )}
                                  </div>
                                )}
                              </InView>
                            )}
                            {blockElement.widget && blockElement.type === 'map' && (
                              <InView triggerOnce threshold={0.25}>
                                {({ ref, inView }) => (
                                  <div
                                    ref={ref}
                                    style={{
                                      height: '100%',
                                    }}
                                  >
                                    {inView && (
                                      <MapWidget
                                        widgetId={blockElement.widget}
                                        params={{
                                          geostore_env: 'geostore_prod',
                                          ...(area?.geostore && {
                                            geostore_id: area.geostore,
                                          }),
                                          ...geostoreProperties,
                                        }}
                                        {...(area?.geostore && {
                                          areaOfInterest: area.geostore,
                                        })}
                                        onToggleShare={handleShareWidget}
                                      />
                                    )}
                                  </div>
                                )}
                              </InView>
                            )}
                            {blockElement.widget && blockElement.type === 'map-swipe' && (
                              <InView triggerOnce threshold={0.25}>
                                {({ ref, inView }) => (
                                  <div
                                    ref={ref}
                                    style={{
                                      height: '100%',
                                    }}
                                  >
                                    {inView && (
                                      <SwipeMapWidget
                                        widgetId={blockElement.widget}
                                        params={{
                                          geostore_env: 'geostore_prod',
                                          ...(area?.geostore && {
                                            geostore_id: area.geostore,
                                          }),
                                          ...geostoreProperties,
                                        }}
                                        {...(area?.geostore && {
                                          areaOfInterest: area.geostore,
                                        })}
                                        onToggleShare={handleShareWidget}
                                      />
                                    )}
                                  </div>
                                )}
                              </InView>
                            )}

                            {blockElement.widget && blockElement.type === 'chart' && (
                              <InView triggerOnce threshold={0.25}>
                                {({ ref, inView }) => (
                                  <div
                                    ref={ref}
                                    style={{
                                      height: '100%',
                                    }}
                                  >
                                    {inView && (
                                      <ChartWidget
                                        widgetId={blockElement.widget}
                                        params={{
                                          ...(area?.geostore && {
                                            geostore_id: area.geostore,
                                          }),
                                          geostore_env: 'geostore_prod',
                                          ...geostoreProperties,
                                        }}
                                        onToggleShare={handleShareWidget}
                                      />
                                    )}
                                  </div>
                                )}
                              </InView>
                            )}
                            {blockElement.visualizationType === 'indicators-set' && (
                              <InView triggerOnce threshold={0.25}>
                                {({ ref, inView }) => (
                                  <div ref={ref}>
                                    {inView && (
                                      <CardIndicatorSet
                                        config={blockElement.config}
                                        params={{
                                          geostore_env: 'geostore_prod',
                                          ...(area?.geostore && {
                                            geostore_id: area.geostore,
                                          }),
                                          ...geostoreProperties,
                                        }}
                                        theme={blockElement?.config?.theme}
                                      >
                                        {(blockElement?.config?.indicators || []).map(
                                          ({ id, title, description, query, format, unit }) => (
                                            <NumericCardIndicator
                                              key={id}
                                              id={id}
                                              data={{
                                                id,
                                                title,
                                                query,
                                                description,
                                                format,
                                                unit,
                                              }}
                                              title={title}
                                              theme={indicatorSetConfiguration?.config?.theme}
                                              params={{
                                                geostore_env: 'geostore_prod',
                                                ...(area?.geostore && {
                                                  geostore_id: area.geostore,
                                                }),
                                                ...geostoreProperties,
                                              }}
                                            />
                                          ),
                                        )}
                                      </CardIndicatorSet>
                                    )}
                                  </div>
                                )}
                              </InView>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <section className="l-section -medium">
          <div className="l-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-full">
                <Banner
                  useDim
                  className="h-full !p-10 md:!p-16"
                  bgImage="/static/images/pages/app/banner-coral.jpg"
                >
                  <div className="flex flex-col h-full justify-center md:items-center">
                    <h4 className="text-lg font-light text-center text-white md:text-xl md:leading-10">
                      Check out the Coral Reefs dashboards
                    </h4>
                    <Link href="/dashboards/coral-reef-dashboards">
                      <a className="c-button -alt -primary w-full md:w-40 text-center py-2 px-4 mt-4 md:mt-0">
                        Coral Reefs
                      </a>
                    </Link>
                  </div>
                </Banner>
              </div>
              <div className="h-full">
                <Banner
                  useDim
                  className="h-full !p-10 md:!p-16"
                  bgImage="/static/images/pages/app/banner-ocean-watch.jpg"
                >
                  <div className="flex flex-col h-full justify-center md:items-center">
                    <h4 className="text-lg font-light text-center text-white md:text-xl md:leading-10">
                      View Ocean Watch Data on WRI Data Explorer
                    </h4>
                    <a
                      className="c-button -alt -primary w-full md:w-40 text-center py-2 px-4 mt-4 md:mt-0"
                      href="https://datasets.wri.org/dataset?q=Ocean"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore
                    </a>
                  </div>
                </Banner>
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
      </div>
      {!!widgetToShare && (
        <WidgetShareModal
          isVisible
          widget={widgetToShare}
          onClose={handleCloseShareWidget}
          params={{
            geostore_env: 'geostore_prod',
            ...(area?.geostore && {
              geostore_id: area.geostore,
              aoi: area.geostore,
            }),
          }}
        />
      )}
      <Modal isOpen={isModalVisible} onRequestClose={onCloseModal}>
        <p>
          The mobile version has limited functionality, please check the desktop version to have
          access to the full list of features available on the Ocean Watch dashboard.
        </p>
      </Modal>
    </LayoutOceanWatch>
  );
}

OceanWatchCountryProfilePage.propTypes = {
  iso: PropTypes.string.isRequired,
};

export async function getStaticProps({ params }) {
  const { iso } = params;
  const queryClient = new QueryClient();

  return {
    props: {
      iso,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 300,
  };
}

export async function getStaticPaths() {
  const queryClient = new QueryClient();

  // prefetch areas
  await queryClient.prefetchQuery('ocean-watch-areas', fetchOceanWatchAreas);
  const areas = queryClient.getQueryData('ocean-watch-areas');

  return {
    paths: areas
      .filter(({ iso }) => iso !== 'GLB')
      .map(({ iso }) => ({
        params: {
          iso,
        },
      })),
    fallback: false,
  };
}
