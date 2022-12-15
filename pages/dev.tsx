import Head from "next/head";
import { ReactElement } from "react";

const Dev = () => {
  return (
    <>
      <Head>
        <title>micropay</title>
        <meta name="description" content="Micropay" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Lightning Payments API for developers | micropay</title>
        <meta
          name="title"
          content="Lightning Payments API for developers | micropay"
        />

        <meta
          name="description"
          content="Instantly integrate the Lightning Network into your app without managing a node ⚡."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://micropay.ai/dev" />
        <meta
          property="og:title"
          content="Lightning Payments API for developers | micropay"
        />
        <meta
          property="og:description"
          content="Instantly integrate the Lightning Network into your app without managing a node ⚡."
        />
        <meta
          property="og:image"
          content="https://micropay.ai/micropay-dev-preview.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://micropay.ai/" />
        <meta
          property="twitter:title"
          content="Lightning Payments API for developers | micropay"
        />
        <meta
          property="twitter:description"
          content="Instantly integrate the Lightning Network into your app without managing a node ⚡."
        />
        <meta
          property="twitter:image"
          content="https://micropay.ai/micropay-dev-preview.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <iframe
        id="micropay-iframe"
        src="https://micropay-dev.framer.website/"
        frameBorder="0"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          position: "fixed",
          top: 0,
        }}
      ></iframe>
    </>
  );
};

Dev.getLayout = (page: ReactElement) => <>{page}</>;

export default Dev;
