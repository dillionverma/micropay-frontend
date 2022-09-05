import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HelpIcon from "@mui/icons-material/Help";
import TelegramIcon from "@mui/icons-material/Telegram";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { default as Image } from "next/image";
import Script from "next/script";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { downloadImage } from "../utils/downloadImage";
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

const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://lightning-dalle2-server.onrender.com";

const Home: NextPage = () => {
  const [invoice, setInvoice] = useState<Invoice>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [prompt, setPrompt] = useState<string>();
  const [images, setImages] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

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
    const response = await fetch(`${SERVER_URL}/invoice`);
    const data = await response.json();
    setInvoice(data);
  };

  const generate = async (): Promise<void> => {
    if (!invoice?.id || !prompt) return;
    const response = await fetch(`${SERVER_URL}/generate`, {
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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
        <script
          defer
          data-domain="describe.photo"
          src="https://plausible.io/js/plausible.js"
        />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-LTPMN00GCF"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-LTPMN00GCF');
        `}
      </Script>

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
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FeedbackIcon />}
                onClick={() =>
                  window.open("https://forms.gle/byhZYvEPyAZxvDLP8", "_blank")
                }
              >
                Submit feedback
              </Button>
              <Button
                variant="outlined"
                startIcon={<HelpIcon />}
                onClick={() =>
                  window.open(
                    "https://pitch.com/v/DALL-E-prompt-book-v1-tmd33y"
                  )
                }
              >
                Learn how to craft a good prompt
              </Button>
            </Stack>

            {invoice && images.length === 0 && (
              <>
                <Typography variant="subtitle1" align="center">
                  Please pay 1000 satoshis to generate images.
                </Typography>

                <QRCodeSVG
                  width={200}
                  height={200}
                  value={invoice?.request || ""}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpen(true);
                    navigator.clipboard.writeText(invoice.request);
                  }}
                  startIcon={<ContentCopyIcon />}
                >
                  Copy invoice
                </Button>

                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    Copied!
                  </Alert>
                </Snackbar>

                <Alert severity="warning">
                  <AlertTitle>Warning</AlertTitle>
                  <strong>
                    Don&apos;t switch tabs or you may lose your images!{" "}
                  </strong>
                  Please wait around 20 seconds after successful payment to
                  receive images.
                </Alert>
              </>
            )}

            {images.length > 0 && (
              <>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Make sure you download your images before leaving this page
                  since we don&apos;t store them!
                </Alert>

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
                  }}
                >
                  Download All
                </LoadingButton>
              </>
            )}
          </Stack>
        </Container>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://t.me/+zGVesHQRbl04NTA5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon sx={{ color: "#229ED9" }} />
        </a>
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
