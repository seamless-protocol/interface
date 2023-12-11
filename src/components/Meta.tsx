import Head from 'next/head';
import React from 'react';

type MetaProps = {
  title: string;
  description: string;
  imageUrl?: string;
  timestamp?: string;
};

export function Meta({ title, description, imageUrl, timestamp }: MetaProps) {
  return (
    <Head>
      <title>Seamless - {title}</title>
      <meta name="description" content={description} key="description" />
      <meta property="og:title" content={`Seamless - ${title}`} key="title" />
      <meta property="og:description" content={description} key="ogdescription" />
      <meta property="og:type" content="website" key="ogtype" />
      <meta property="og:url" content="https://app.seamlessprotocol.com/" key="ogurl" />
      {imageUrl && <meta property="og:image" content={imageUrl} key="ogimage" />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} key="twitterimage" />}
      <meta name="twitter:site" content="@seamlessfi" key="twittersite" />
      <meta
        property="twitter:card"
        content={imageUrl ? 'summary_large_image' : 'summary'}
        key="twittercard"
      />
      <meta name="twitter:domain" content="http://app.seamlessprotocol.com/" key="twitterdomain" />
      <meta name="twitter:url" content="https://app.seamlessprotocol.com/" key="twitterurl" />
      <meta name="twitter:title" content={`Seamless - ${title}`} key="twittertitle" />
      <meta name="twitter:description" content={description} key="twitterdescription" />
      {timestamp && <meta name="revised" content={timestamp} key="timestamp" />}
      <meta
        name="keywords"
        key="keywords"
        content="Decentralized Finance, DeFi, lending, borrowing, stablecoins, Ethereum, assets, erc-20, smart contracts, open finance, trustless"
      />
      <link rel="icon" href="/black_logo_seamless.svg" />
      <link rel="apple-touch-icon" href="/black_logo_seamless.svg" />
      <meta name="apple-mobile-web-app-title" content={`Seamless`} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    </Head>
  );
}
