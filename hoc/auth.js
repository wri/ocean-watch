import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

// lib
import wrapper from 'lib/store';

const queryClient = new QueryClient();

export const withRedux = (getServerSidePropsFunc) =>
  wrapper.getServerSideProps((store) => async (context) => {
    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc({ ...context, store });

      return {
        ...SSPF,
      };
    }

    return {
      props: {},
    };
  });

export function withUserServerSide(getServerSidePropsFunc) {
  return async (contextWithStore) => {
    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc(contextWithStore);

      return {
        ...SSPF,
      };
    }

    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc(contextWithStore, contextWithStore.store);

      const { props: SSPFProps, ...SSPFRest } = SSPF;

      return {
        props: {
          ...SSPFProps,
          dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
        ...SSPFRest,
      };
    }

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  };
}
