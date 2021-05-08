// Heavily inspired by https://github.com/FormidableLabs/next-urql/blob/master/src/with-urql-client.tsx

import { NextPage, NextPageContext } from 'next';
import NextApp, { AppContext } from 'next/app';
import React from 'react';
import ssrPrepass from 'react-ssr-prepass';
import { fetchStore } from './myFetch';

function getDisplayName(Component: React.ComponentType<any>) {
  return Component.displayName || Component.name || 'Component';
}

export function withPrepass() {
  return (AppOrPage: NextPage<any> | typeof NextApp) => {
    const withPrepass = (props: any) => {
      return (
          <AppOrPage {...props} />
      );
    };

    withPrepass.displayName = `withPrepass(${getDisplayName(AppOrPage)})`;

    withPrepass.getInitialProps = async (appOrPageCtx: AppContext | NextPageContext) => {
      const { AppTree } = appOrPageCtx;

      // Determine if we are wrapping an App component or a Page component.
      const isApp = !!(appOrPageCtx as AppContext).Component;
      const ctx = isApp
        ? (appOrPageCtx as AppContext).ctx
        : (appOrPageCtx as NextPageContext);

      // Run the wrapped component's getInitialProps function.
      let pageProps;
      if (AppOrPage.getInitialProps) {
        pageProps = await AppOrPage.getInitialProps(appOrPageCtx as any);
      }

      // Check the window object to determine whether or not we are on the server.
      // getInitialProps runs on the server for initial render, and on the client for navigation.
      // We only want to run the prepass step on the server.
      if (typeof window !== 'undefined') {
        return pageProps ?? {};
      }

      const props = { ...pageProps };
      const appTreeProps = isApp ? props : { pageProps: props };

      // Run the prepass step on AppTree. This will run all urql queries on the server.
      await ssrPrepass(<AppTree {...appTreeProps} />, (element, instance) => {
        const getSsrData = (element as any)?.type?.getSsrData
        if(typeof getSsrData === "function"){
          getSsrData()
        }
      });

      return {
        ...pageProps,
        fetchStore
      };
    };

    return withPrepass;
  };
}
