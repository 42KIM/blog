import Layout from '@/components/layout';
import '@/styles/globals.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

type PageComponentWithProps = NextPage & {
  getLayoutProps?: () => Parameters<typeof Layout>[0],
  getPageProps?: () => {
    pageTitle?: string,
    pageDescription?: string,
  },
};

export default function App({ Component, pageProps }: AppProps & { Component: PageComponentWithProps }) {
  const layoutProps = Component.getLayoutProps?.() || {};

  const { pageTitle, pageDescription } = Component.getPageProps?.() || {};

  return (
    <>
      <Head>
        <title>{pageTitle ? `${pageTitle} - 42's blog` : '42\'s blog'}</title>
        <meta name="description" content={pageDescription || '프론트엔드 개발자 42KIM의 개인 기술 블로그'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecoilRoot>
        <Layout {...layoutProps}>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </>
  );
}
