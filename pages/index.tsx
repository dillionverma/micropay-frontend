import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BrushIcon from "@mui/icons-material/Brush";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import PhoneIcon from "@mui/icons-material/Phone";
import RedditIcon from "@mui/icons-material/Reddit";
import TelegramIcon from "@mui/icons-material/Telegram";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Badge,
  BadgeProps,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputAdornment,
  LinearProgress,
  Link,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Filter from "bad-words";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { QRCodeSVG } from "qrcode.react";
import { KeyboardEvent, useEffect, useState } from "react";
import { requestProvider } from "webln";
import {
  CashappIcon,
  LightningIcon,
  StrikeIcon,
} from "../src/assets/icons/icons";
import Feedback from "../src/components/Feedback";
import { downloadImage } from "../src/utils/downloadImage";
import { getRandomElement } from "../src/utils/index";
import { useInterval } from "../src/utils/useInterval";
import styles from "../styles/Home.module.css";

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

export const officialPrompts = [
  "a macro 35mm photograph of two mice in Hawaii, they're each wearing tiny swimsuits and are carrying tiny surf boards, digital art",
  "3D render of a cute tropical fish in an aquarium on a dark blue background, digital art",
  "an astronaut playing basketball with cats in space, digital art",
  "an astronaut lounging in a tropical resort in space, pixel art",
  "an oil pastel drawing of an annoyed cat in a spaceship",
  "a sunlit indoor lounge area with a pool with clear water and another pool with translucent pastel pink water, next to a big window, digital art",
  '"a sea otter with a pearl earring" by Johannes Vermeer',
  "photograph of an astronaut riding a horse",
  "crayon drawing of several cute colorful monsters with ice cream cone bodies on dark blue paper",
  "a pencil and watercolor drawing of a bright city in the future with flying cars",
  "a stained glass window depicting a robot",
  "teddy bears shopping for groceries, one-line drawing",
  "a painting of a fox in the style of Starry Night",
  "a bowl of soup that looks like a monster, knitted out of wool",
  "a fortune-telling shiba inu reading your fate in a giant hamburger, digital art",
  "an expressive oil painting of a basketball player dunking, depicted as an explosion of a nebula",
  "a stern-looking owl dressed as a librarian, digital art",
  "an oil painting by Matisse of a humanoid robot playing chess",
  "a bowl of soup that is also a portal to another dimension, digital art",
  "synthwave sports car",
  "panda mad scientist mixing sparkling chemicals, digital art",
];

const DEFAULT_ORDER_STATUS = "Order received! Waiting for payment...";

export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://micropay-server.onrender.com";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#7B1AF7",
  },
}));

const Home: NextPage = () => {
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [invoice, setInvoice] = useState<Invoice>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [refundErrorMessage, setRefundErrorMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [showRefund, setShowRefund] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(60);
  const [weblnEnabled, setWebLnEnabled] = useState<boolean>(false);

  const [serverErrorAlert, setServerErrorAlert] = useState<boolean>(false);

  const [refundInvoice, setRefundInvoice] = useState<string>("");
  const [refundInvoiceSent, setRefundInvoiceSent] = useState<boolean>(false);

  const [stopGeneratePolling, setStopGeneratePolling] =
    useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<string>(DEFAULT_ORDER_STATUS);
  const [open, setOpen] = useState<boolean>(false);

  const [showBulkPurchase, setShowBulkPurchase] = useState<boolean>(false);
  const [mockImages, setMockImages] = useState<boolean>(false);

  // prompt the user if they try and leave with unsaved changes
  useEffect(() => {
    (async () => {
      const resp = await axios.get(`${SERVER_URL}/mock-images`);
      setMockImages(resp.data);
    })();

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

  const getInvoice = async (prompt: string): Promise<Invoice | null> => {
    const response = await axios.post(
      `${SERVER_URL}/invoice`,
      { prompt },
      { validateStatus: () => true }
    );

    if (response.status === 200) {
      setInvoice(response.data);
      setServerErrorAlert(false);
      return response.data;
    } else {
      setServerErrorAlert(true);
      return null;
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

  const getStatus = async (): Promise<void> => {
    if (!invoice?.id) return;
    const response = await axios.get(
      `${SERVER_URL}/generate/${invoice.id}/status?webln=${weblnEnabled}`
    );
    const data = response.data;
    setOrderStatus(data.message);
    setProgress(data.progress);
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
        await getStatus();
      }
    },
    stopGeneratePolling ? null : 1000 // when set to null, we stop polling
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
    let flagged = { data: false };
    try {
      flagged = await axios.post(`${SERVER_URL}/check-prompt`, { prompt });
    } catch (e) {
      setErrorMessage(
        "checking for prompt flagging failed, continuing without..."
      );
      //implement a blocking sleep for 2 seconds
      await new Promise((r) => setTimeout(r, 2000));
    }
    if (!prompt) {
      setErrorMessage("Please enter a prompt");
    } else if (filter.isProfane(prompt)) {
      setErrorMessage("Please enter a non-profane prompt");
    } else {
      const invoice = await getInvoice(prompt);

      setShowTitle(false);
      setImages([]);
      setOrderStatus(DEFAULT_ORDER_STATUS);
      setStopGeneratePolling(false);
      setProgress(20);
      try {
        const webln = await requestProvider();
        setWebLnEnabled(true);
        if (invoice) await webln.sendPayment(invoice.request);
      } catch (err) {
        // Tell the user what went wrong
        console.error(err);
      }
    }
  };

  const [promptPressed, setPromptPressed] = useState<boolean>(false);
  const [promptPlaceholder, setPromptPlaceholder] = useState<string>(
    "An avocado in the form of an armchair"
  );
  const getPrompt = () => {
    const randomPrompt =
      officialPrompts[Math.floor(Math.random() * officialPrompts.length)];

    setPrompt(randomPrompt);
  };
  const reset = () => {
    setInvoice(undefined);
    setImages([]);
    setOrderStatus(DEFAULT_ORDER_STATUS);
    setStopGeneratePolling(false);
    setProgress(20);
  };

  useInterval(() => {
    if (!promptPressed) return;
    setPromptPlaceholder(getRandomElement(officialPrompts));
  }, 4000);

  const handleKeypress = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      await generateButtonHandler();
    }
  };

  return (
    <>
      <Head>
        <title>micropay</title>
        <meta name="description" content="Micropay" />
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
            {showTitle && (
              <>
                <a href="/">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{ width: "17%", paddingTop: "4px" }}
                      src="./micro.png"
                      alt=""
                    />
                    <h1 className={styles.title}>Dalle-2 Image Generator</h1>
                  </div>
                </a>
                <p style={{ margin: "auto", fontSize: "20px" }}>
                  With Facial Restoration
                </p>
              </>
            )}

            {process.env.NODE_ENV === "development" && (
              <strong style={{ color: "red" }}>
                Development with Mock Images = {mockImages.toString()}
              </strong>
            )}

            {!invoice && (
              <>
                <TextField
                  error={!!errorMessage && images.length === 0}
                  helperText={errorMessage}
                  fullWidth
                  label="Type something you won't find online"
                  // label="Use your imagination to create something new"
                  placeholder={promptPlaceholder}
                  value={prompt}
                  multiline
                  id="fullWidth"
                  InputProps={{
                    endAdornment: (
                      //wand icon
                      <InputAdornment position="end">
                        <Tooltip title="Generate random prompt" placement="top">
                          <IconButton
                            aria-label="generate"
                            onClick={() => {
                              setPrompt(getRandomElement(officialPrompts));
                            }}
                          >
                            <AutoFixHighIcon style={{ color: "#000" }} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  onFocus={() => {
                    setPromptPressed(true);
                  }}
                  onBlur={() => {
                    setPromptPressed(false);
                  }}
                  // onKeyDown={handleKeypress}
                  onChange={(e) => {
                    // setPromptPressed(true);
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

                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="center"
                  className="button-container"
                  // alignItems={"stretch"}
                >
                  <Grid item xs={6} sm={6}>
                    <StyledBadge
                      badgeContent={0}
                      // color="success"
                      style={{ width: "100%" }}
                    >
                      <LoadingButton
                        variant="contained"
                        style={{ width: "100%" }}
                        color="primary"
                        loading={invoice && images.length === 0 && !showRefund}
                        // loadingIndicator="Waiting for payment…"
                        loadingPosition="center"
                        onClick={() => generateButtonHandler()}
                      >
                        Dalle ($0.20)
                      </LoadingButton>
                    </StyledBadge>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <StyledBadge
                      badgeContent={"3/3"}
                      color="success"
                      style={{ width: "100%" }}
                    >
                      <Tooltip title="Coming soon" placement="top">
                        <LoadingButton
                          variant="contained"
                          style={{
                            width: "100%",
                            backgroundColor: grey[200],
                            color: "black",
                          }}
                          // disabled
                          loading={
                            invoice && images.length === 0 && !showRefund
                          }
                          // loadingIndicator="Waiting for payment…"
                          loadingPosition="center"
                          // onClick={() => generateButtonHandler()}
                        >
                          Non Dalle (FREE)
                        </LoadingButton>
                      </Tooltip>
                    </StyledBadge>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Tooltip title="Coming soon" placement="top">
                      <LoadingButton
                        variant="contained"
                        // disabled
                        style={{
                          width: "100%",
                          backgroundColor: "#d1b9f0",
                          color: "black",
                        }}
                        loading={invoice && images.length === 0 && !showRefund}
                        // loadingIndicator="Waiting for payment…"
                        loadingPosition="center"
                        onClick={() => setShowBulkPurchase(!showBulkPurchase)}
                      >
                        Bulk Purchase
                      </LoadingButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <br></br>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="center"
                  className="button-container"
                  // alignItems={"stretch"}
                >
                  <Grid item xs={3} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      style={{ color: "red", borderColor: "red" }}
                      onClick={() => {
                        window.open("https://reddit.com/r/micropay");
                      }}
                      startIcon={<RedditIcon style={{ color: "red" }} />}
                    >
                      JOIN
                    </Button>
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      style={{ color: "#2AABEE", borderColor: "#2AABEE" }}
                      onClick={() => {
                        window.open("https://t.me/+zGVesHQRbl04NTA5");
                      }}
                      startIcon={<TelegramIcon style={{ color: "#2AABEE" }} />}
                    >
                      JOIN
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      onClick={() => {
                        window.open("https://calendly.com/micropay/");
                      }}
                      style={{
                        color: "#33cc33",
                        borderColor: "#33cc33",
                        whiteSpace: "nowrap",
                      }}
                      startIcon={<PhoneIcon style={{ color: "#33cc33" }} />}
                    >
                      CALL US
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}

            {
              //Refund page not being used anymore
              /* {showRefund && !refundInvoiceSent && (
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
            )} */
            }

            {/* {showRefund && refundInvoiceSent && (
              <Alert severity="success">
                Refund invoice sent. We will manually refund you.
              </Alert>
            )} */}
            {invoice && images.length === 0 && !showRefund && (
              <>
                <Typography
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    margin: "0",
                  }}
                >
                  Please scan the QR Code below
                </Typography>
                <Typography
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    margin: "0",
                  }}
                >
                  Cost: 1000 satoshis
                </Typography>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="center"
                  className="button-container"
                  // alignItems={"stretch"}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    justifyContent="center"
                    display={"flex"}
                    flexDirection="column"
                  >
                    <QRCodeSVG
                      style={{
                        width: "100%",
                        alignSelf: "center",
                      }}
                      width={200}
                      height={200}
                      onClick={() => {
                        window.open(`lightning:${invoice?.request}`);
                      }}
                      value={invoice?.request || ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} textAlign="center">
                    <Button
                      style={{ margin: "10px auto", width: "70%" }}
                      variant="outlined"
                      onClick={() => {
                        setOpen(true);
                        navigator.clipboard.writeText(invoice.request);
                      }}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy invoice
                    </Button>
                    <Typography variant="h6" gutterBottom>
                      OR
                    </Typography>
                    <Grid container>
                      <Grid item xs={6} sm={12} md={12}>
                        <Button
                          variant="outlined"
                          style={{
                            color: "#00D632",
                            borderColor: "#00D632",
                            width: "100%",
                            margin: "0px 0",
                          }}
                          onClick={() => {
                            window.open("https://cash.app/$");
                          }}
                          startIcon={<CashappIcon />}
                        >
                          Open Cash App
                        </Button>
                      </Grid>
                      <Grid item xs={6} sm={12} md={12}>
                        <Button
                          variant="outlined"
                          style={{
                            color: "#000",
                            borderColor: "#000",
                            width: "100%",
                            margin: "0px 0",
                          }}
                          startIcon={<StrikeIcon />}
                          onClick={() => {
                            window.open("https://strike.me/");
                          }}
                        >
                          Open Strike.me
                        </Button>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        {/* <Divider style={{ margin: "16px 0" }} />
                        <Typography variant="h5" gutterBottom>
                          Advanced
                        </Typography> */}
                        <Button
                          variant="outlined"
                          style={{
                            color: "#f7931a",
                            borderColor: "#f7931a",
                            width: "100%",
                            margin: "0px 0",
                          }}
                          startIcon={<LightningIcon />}
                          onClick={() => {
                            window.open(`lightning:${invoice?.request}`);
                          }}
                        >
                          Open Lightning App
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle1" align="center">
                    Status: {orderStatus}
                  </Typography>
                  <LinearProgress
                    style={{ margin: "10px 0" }}
                    variant="determinate"
                    value={progress}
                  />

                  <Typography variant="subtitle1" align="center">
                    Experiencing problems? Message us on{" "}
                    <a
                      href="https://t.me/+zGVesHQRbl04NTA5"
                      style={{ color: "#0070f3" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Telegram
                    </a>
                    .
                  </Typography>
                </Box>

                <div style={{ paddingTop: "2%" }}></div>

                <Button
                  variant="outlined"
                  color="primary"
                  style={{
                    // color: "#f7931a",
                    // borderColor: "#f7931a",
                    // width: "100%",
                    margin: "8px 0",
                  }}
                  startIcon={<ArrowBackIcon />}
                  onClick={() => {
                    reset();
                  }}
                >
                  Go Back
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
                {/* {weblnEnabled && (
                  <Chip
                    style={{ marginTop: 30 }}
                    icon={<VerifiedIcon />}
                    label="webln enabled"
                    size="small"
                    variant="filled"
                    color="success"
                  />
                )} */}
              </>
            )}
            {images.length > 0 && (
              <>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Please download your images before moving on! We don't store
                  them.
                </Alert>

                <ImageList
                  sx={{ width: "100%" }}
                  cols={largeScreen ? 4 : 4}
                  rowHeight={150}
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
                                await downloadImage(
                                  item,
                                  `image-${Math.random()
                                    .toString(36)
                                    .substring(2, 15)}.png`
                                );
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
                <Grid container direction="row">
                  <Grid item xs={6} md={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      style={{
                        color: "#000000",
                        paddingTop: "2vh",
                        paddingBottom: "2vh",
                        borderColor: "#000000",
                      }}
                      startIcon={<DownloadIcon />}
                      onClick={async () => {
                        const zip = new JSZip();
                        for (let i = 0; i < images.length; i++) {
                          const response = await fetch(images[i]);
                          const blob = await response.blob();
                          zip.file(
                            `image-${Math.random()
                              .toString(36)
                              .substring(2, 15)}.png`,
                            blob
                          );
                        }
                        zip.generateAsync({ type: "blob" }).then((content) => {
                          saveAs(
                            content,
                            `images - ${prompt.substring(0, 20)}.zip`
                          );
                        });
                      }}
                    >
                      Download All
                    </Button>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      style={{
                        color: "#7b1af7",
                        borderColor: "#7b1af7",
                        paddingTop: "2vh",
                        paddingBottom: "2vh",
                      }}
                      startIcon={<BrushIcon />}
                      onClick={async () => {
                        window.open("/");
                      }}
                    >
                      CREATE MORE
                    </Button>
                  </Grid>
                </Grid>

                <Feedback invoiceId={invoice?.id} />
              </>
            )}
            {/* <FAQ /> */}
            {/* <SubscribeEmail /> */}
          </Stack>
        </Container>
      </main>
    </>
  );
};

export default Home;
