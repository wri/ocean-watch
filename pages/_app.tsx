import { FC } from 'react';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

// lib
import wrapper from 'lib/store';
import MediaContextProvider from 'lib/media';

// es6 shim for .finally() in promises
import finallyShim from 'promise.prototype.finally';

// global styles
import 'css/index.scss';

finallyShim.shim();

const queryClient = new QueryClient();

const OceanWatchApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID && (
        <noscript>
          {/* Google Tag Manager (noscript) */}
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID}`}
            height={0}
            width={0}
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          />
          {/* End Google Tag Manager (noscript) */}
        </noscript>
      )}

      <QueryClientProvider client={queryClient}>
        <MediaContextProvider>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </MediaContextProvider>
      </QueryClientProvider>
    </>
  );
};

export default wrapper.withRedux(OceanWatchApp);
