import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import TelegramIcon from "@mui/icons-material/Telegram";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import Filter from "bad-words";
import type { NextPage } from "next";
import Head from "next/head";
import { default as Image } from "next/image";
import Script from "next/script";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { downloadImage } from "../utils/downloadImage";
import { useInterval } from "../utils/useInterval";
import FAQ from "./components/FAQ";
import Feedback from "./components/Feedback";
import SubscribeEmail from "./components/SubscribeEmail";
const filter = new Filter();

// this one was used quite a bit
filter.addWords("dickbutt");
filter.removeWords("god");

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

const DEFAULT_ORDER_STATUS = "Invoice not paid yet";

export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://micropay-server.onrender.com";

const Home: NextPage = () => {
  const [invoice, setInvoice] = useState<Invoice>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [refundErrorMessage, setRefundErrorMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [showRefund, setShowRefund] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const [serverErrorAlert, setServerErrorAlert] = useState<boolean>(false);

  const [refundInvoice, setRefundInvoice] = useState<string>("");
  const [refundInvoiceSent, setRefundInvoiceSent] = useState<boolean>(false);

  const [stopGeneratePolling, setStopGeneratePolling] =
    useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<string>(DEFAULT_ORDER_STATUS);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (orderStatus === "INVOICE_NOT_PAID") {
      setProgress(0);
    } else if (
      orderStatus === "Invoice paid! Dalle-2 is currently generating images..."
    ) {
      setProgress(70);
    }
  }, [orderStatus]);

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

  const getInvoice = async (prompt: string): Promise<void> => {
    const response = await axios.post(
      `${SERVER_URL}/invoice`,
      { prompt },
      { validateStatus: () => true }
    );

    if (response.status === 200) {
      setInvoice(response.data);
      setServerErrorAlert(false);
    } else {
      setServerErrorAlert(true);
    }
  };

  const sendRefundInvoice = async (
    invoiceId: string,
    refundInvoice: string
  ): Promise<void> => {
    const refund = await axios.post(`${SERVER_URL}/refund`, {
      invoiceId: invoiceId,
      refundInvoice: refundInvoice,
    });
    setRefundInvoiceSent(true);
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

    setOrderStatus(data.message);
    if (data.status === "DALLE_GENERATED") {
      setImages(data.images);
      setStopGeneratePolling(true);
    } else if (
      data.status === "DALLE_FAILED" ||
      data.status === "SERVER_ERROR"
    ) {
      setShowRefund(true);
      setStopGeneratePolling(true);
    }
  };

  useInterval(
    async () => {
      if (invoice && images.length === 0) {
        await generate();
      }
    },
    stopGeneratePolling ? null : 2000 // when set to null, we stop polling
  );

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

  const generateButtonHandler = async () => {
    if (!prompt) {
      setErrorMessage("Please enter a prompt");
    } else if (filter.isProfane(prompt)) {
      setErrorMessage("Please enter a non-profane prompt");
    } else {
      await getInvoice(prompt);
      setImages([]);
      setOrderStatus(DEFAULT_ORDER_STATUS);
      setStopGeneratePolling(false);
      setProgress(0);
    }
    setTimeout(() => {
      document
        .getElementById("anchor-invoice")!
        .scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      generateButtonHandler();
    }
  };

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

      <Alert
        severity="error"
        style={{ width: "100%", justifyContent: "center" }}
      >
        <AlertTitle>
          Warning: This software is still very early in development. Use at your
          own risk.
        </AlertTitle>
        We&apos;re currently dealing with increased traffic.{" "}
        <strong>
          If you paid an invoice and didn&apos;t recieve images, please share
          the invoice you paid to this{" "}
          <a
            href="https://forms.gle/c2tGbDJ2Hg9jvVbF9"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(103, 58, 183)" }}
            // google form color code hex
          >
            form.
          </a>{" "}
          For status updates, join our Telegram support group{" "}
          <a
            href="https://t.me/+zGVesHQRbl04NTA5"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#229ED9" }}
          >
            here
          </a>
          .
        </strong>
      </Alert>
      <main className={styles.main}>
        <Container maxWidth="sm">
          <Stack direction="column" spacing={2} alignItems="center">
            <h1 className={styles.title}>Dalle-2 Image generator</h1>
            <h6 className={styles.subtitle}>
              ⚡ A picture is worth a thousand sats ⚡
            </h6>
            <TextField
              error={!!errorMessage && images.length === 0}
              helperText={errorMessage}
              fullWidth
              label="Enter prompt"
              id="fullWidth"
              onKeyDown={handleKeypress}
              onChange={(e) => {
                setPrompt(e.target.value);
                setErrorMessage("");
              }}
            />

            {serverErrorAlert && (
              <Alert
                severity="error"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <AlertTitle>
                  Uh-oh, something went wrong in the server
                </AlertTitle>
              </Alert>
            )}

            <LoadingButton
              variant="contained"
              style={{ width: "100%" }}
              color="primary"
              loading={invoice && images.length === 0 && !showRefund}
              // loadingIndicator="Waiting for payment…"
              loadingPosition="center"
              onClick={() => generateButtonHandler()}
            >
              Generate
            </LoadingButton>

            {showRefund && !refundInvoiceSent && (
              <>
                <Alert severity="error">
                  <AlertTitle>Uh-oh</AlertTitle>
                  Something went wrong during generation. Please paste an
                  invoice for a refund
                </Alert>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <TextField
                    style={{ flex: 1 }}
                    fullWidth
                    id="refund"
                    error={!!refundErrorMessage && images.length === 0}
                    helperText={refundErrorMessage}
                    label="Enter an invoice for a refund. We will manually refund you."
                    onChange={(e) => {
                      setRefundInvoice(e.target.value);
                      setRefundErrorMessage("");
                    }}
                  />
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="outlined"
                    onClick={async () => {
                      if (invoice && refundInvoice) {
                        await sendRefundInvoice(invoice.id, refundInvoice);
                        setRefundErrorMessage("");
                      } else {
                        setRefundErrorMessage("Please enter an invoice");
                      }
                    }}
                    startIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </div>
              </>
            )}
            {showRefund && refundInvoiceSent && (
              <Alert severity="success">
                Refund invoice sent. We will manually refund you.
              </Alert>
            )}

            {invoice && images.length === 0 && !showRefund && (
              <>
                <Alert severity="warning" id="anchor-invoice">
                  <AlertTitle>Warning</AlertTitle>
                  Please wait around 20 seconds after successful payment to
                  receive images.
                </Alert>
                <Typography variant="subtitle1" align="center">
                  Please pay 1000 satoshis to generate images.
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Order status: {orderStatus}
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <QRCodeSVG
                  width={200}
                  height={200}
                  onClick={() => {
                    window.open(`lightning:${invoice?.request}`);
                  }}
                  value={invoice?.request || ""}
                />
                <Box sx={{ width: "100%", overflowWrap: "break-word" }}>
                  <p>{invoice.request}</p>
                </Box>
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

                <Feedback invoiceId={invoice?.id} />
              </>
            )}

            <FAQ />
            <SubscribeEmail />
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
        {/* <Typography variant="subtitle1" align="center">
          Made with ❤️ by{" "}
          <a
            href="https://twitter.com/dillionverma"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#229ED9" }}
          >
            Dillion{" "}
          </a>
        </Typography> */}
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
