import DownloadIcon from "@mui/icons-material/Download";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { default as Image } from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import { useInterval } from "../utils/useInterval";

interface Invoice {
  chain_address: string;
  created_at: Date;
  description: string;
  id: string;
  mtokens: string;
  payment: string;
  request: string;
  secret: string;
  tokens: number;
}

const downloadImage = async (url: string, name: string): Promise<void> => {
  return fetch(url)
    .then((resp) => {
      return resp.blob();
    })
    .then((blob) => {
      console.log(blob);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename you want
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => console.log("An error sorry", e));
};

const Home: NextPage = () => {
  const [invoice, setInvoice] = useState<Invoice>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [prompt, setPrompt] = useState<string>();
  const [images, setImages] = useState<string[]>([]);

  // prompt the user if they try and leave with unsaved changes
  useEffect(() => {
    const unsavedChanges = images.length > 0;
    const warningText =
      "You have unsaved changes - are you sure you wish to leave this page?";
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!unsavedChanges) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [images]);

  const getInvoice = async (): Promise<void> => {
    const response = await fetch("http://localhost:3001/invoice");
    const data = await response.json();
    setInvoice(data);
  };

  const generate = async (): Promise<void> => {
    if (!invoice?.id || !prompt) return;
    const response = await fetch("http://localhost:3001/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        invoiceId: invoice.id,
      }),
    });
    const data = await response.json();

    if (!data.error) setImages(data);
  };

  useInterval(async () => {
    if (invoice && images.length === 0) {
      await generate();
    }
  }, 5000);

  const theme = useTheme();

  const largeScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Head>
        <title>Dalle-2 Image Generator</title>
        <meta name="description" content="Dalle-2 Image Generator" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <main className={styles.main}>
        <Container maxWidth="sm">
          <Stack direction="column" spacing={2} alignItems="center">
            <h1 className={styles.title}>Dalle-2 Image generator</h1>

            <TextField
              error={!!errorMessage && images.length === 0}
              helperText={errorMessage && images.length === 0}
              fullWidth
              label="Enter prompt"
              id="fullWidth"
              onChange={(e) => {
                setPrompt(e.target.value);
                setErrorMessage("");
              }}
            />

            <LoadingButton
              variant="contained"
              style={{ width: "100%" }}
              color="primary"
              loading={invoice && images.length === 0}
              // loadingIndicator="Waiting for payment…"
              loadingPosition="center"
              // endIcon={<SendIcon />}
              onClick={async () => {
                if (!prompt) {
                  setErrorMessage("Please enter a prompt");
                } else {
                  await getInvoice();
                  setImages([]);
                }
              }}
            >
              Generate
            </LoadingButton>
            {invoice && (
              <>
                <QRCodeSVG
                  width={200}
                  height={200}
                  value={invoice?.request || ""}
                />
                {images.length === 0 && (
                  <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    <strong>
                      Don&apos;t switch tabs or you may lose your images!{" "}
                    </strong>
                    Please wait around 20 seconds after successful payment to
                    receive images.
                  </Alert>
                )}
                {images.length > 0 && (
                  <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Make sure you download your images before leaving this page
                    since we don&apos;t store them!
                  </Alert>
                )}
              </>
            )}

            {images.length > 0 && (
              <>
                <LoadingButton
                  variant="contained"
                  style={{ width: "100%" }}
                  color="primary"
                  loading={invoice && images.length === 0}
                  loadingPosition="center"
                  onClick={async () => {
                    let i = 1;
                    for (const image of images) {
                      await downloadImage(image, `image-${i}.png`);
                      i++;
                    }
                    // images.forEach(
                    //   async (image, i) =>
                    // );
                    // await Promise.all(
                    //   images.map(
                    //     async (image, i) =>
                    //       await downloadImage(image, `image-${i + 1}.png`)
                    //   )
                    // );
                  }}
                >
                  Download All
                </LoadingButton>
                <ImageList
                  sx={{ width: "100%" }}
                  cols={largeScreen ? 2 : 2}
                  rowHeight={300}
                >
                  {images.map((item, i) => (
                    <Link
                      href={item}
                      key={item}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      <ImageListItem>
                        <img
                          src={item}
                          srcSet={item}
                          alt={item}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          sx={{
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                              "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                          }}
                          // title={item.title}
                          position="bottom"
                          actionIcon={
                            <IconButton
                              sx={{ color: "white" }}
                              onClick={async (e) => {
                                e.preventDefault();
                                await downloadImage(item, `image-${i + 1}.png`);
                              }}
                              // aria-label={`star ${item.title}`}
                            >
                              <DownloadIcon />
                            </IconButton>
                          }
                          actionPosition="right"
                        />
                      </ImageListItem>
                    </Link>
                  ))}
                </ImageList>
              </>
            )}
            {/* <a download="test.png" href={img} title="my image">
              <Image
                src={img}
                height={200}
                width={200}
                // onClick={async () => {
                //   await downloadImage(img, "dalle-2");
                // }}
              />
            </a> */}
          </Stack>
        </Container>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://lightning.network/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image
              src="/bitcoin.svg"
              alt="Vercel Logo"
              width={20}
              height={20}
            />
          </span>
          <span className={styles.logo}>
            <Image
              src="/lightning.svg"
              alt="Vercel Logo"
              width={20}
              height={20}
            />
          </span>
        </a>
      </footer>
    </>
  );
};

export default Home;
