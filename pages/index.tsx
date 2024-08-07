import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BrushIcon from "@mui/icons-material/BrushOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Badge,
  BadgeProps,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputAdornment,
  LinearProgress,
  Link,
  Skeleton,
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
import { QRCodeSVG } from "qrcode.react";
import { KeyboardEvent, useEffect, useState } from "react";
import { requestProvider } from "webln";
import { LightningIcon } from "../src/assets/icons/icons";
import CashappModal from "../src/components/CashappModal";
import Feedback from "../src/components/Feedback";
import StrikeMeModal from "../src/components/StrikeMeModal";
import profanity from "../src/constants/profanity.json";
import { Mixpanel } from "../src/mixpanel";
import { downloadImage } from "../src/utils/downloadImage";
import { getRandomElement } from "../src/utils/index";
import { useInterval } from "../src/utils/useInterval";
import styles from "../styles/Home.module.css";

const filter = new Filter();
filter.addWords(...profanity.profanityList);
filter.removeWords("god");

interface DalleResponse {
  id: string;
  uuid: string;
  request: string;
  // chain_address: string;
  // created_at: Date;
  // description: string;
  // id: string;
  // mtokens: string;
  // payment: string;
  // request: string;
  // secret: string;
  // tokens: number;
}

export const officialPrompts = [
  "a macro 35mm photograph of two mice in Hawaii, they're each wearing tiny swimsuits and are carrying tiny surf boards, digital art",
  "3D render of a cute tropical fish in an aquarium on a dark blue background, digital art",
  "an astronaut playing basketball with cats in space, digital art",
  "an astronaut lounging in a tropical resort in space, pixel art",
  "an oil pastel drawing of an annoyed cat in a spaceship",
  "a sunlit indoor lounge area with a pool with clear water and another pool with translucent pastel pink water, next to a big window, digital art",
  'a sea otter with a pearl earring" by Johannes Vermeer',
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
  "a bar sign that depicts two skeletons laughing and drinking at a table",
  "Homer Simpson in a spacesuit, digital art",
  "a cybertronic bison, leds, high detail, sharp, studio, digital art",
  "a painting of a cat in a spaceship, digital art",
  "cyber punk red bull with black background and bitcoin logo",
  "cyberpunk cow riding a bike with neon glasses and canadian flag",
  "cyberpunk rabbit riding bicycle",
  "1980's cyberpunk city",
  "80's style bitcoin logo",
  "8bit graphics bitcoin logo",
  "a stained glass window depicting a robot eating a turkey",
  "teddy bears shopping for groceries, photorealistic, 4K art",
  "A shiba inu eating a sandwich in berlin city, cyberpunk style",
  "Old man playing jeopardy and looking puzzled in cartoon style",
  "Cartoon picture of an old man on a tractor with a republican hat in a vineyard",
  "rainbow unicorn astronaut floating in space",
  "Digital version of the Wizard of Oz with Dorothy on her way to Emerald City on the road of nonce. Bitcoin cyberpunk pink and blue neon fantasy world. Anime",
  "photorealistic cyberpunk bitcoin hacker",
  "lightning wizard bitcoin pixel art",
  "orange and black calico kitten playing with a killer whale, in a cloud, japanese anime water color style",
  "pixel art of a Charizard looking badass with sunglasses",
  "a cashew nut with laser sunglasses, purple background, pixel art",
  "a chocolate coated crocodile hunting a jar of marmalade, digital art",
  "Unicorn on a bus with Santa Claus",
  "female wizard riding a dragon in the moonlight, style luis royo",
  "High resolution photo of a latte with the bitcoin logo as latte art",
  "three deer dancing under the moonlight",
  "Monkey riding a tricycle wearing a purple hat",
  "bitcoins flying through space on a rainbow",
  "Cat wearing an armored suit, with clear eyes, ultra hd, photo realistic",
  "A panda sitting happily on top of a drum",
  "A brown cat wearing a hat smiling, in crater on the moon, photo realistic",
  "Olympic wrestling athlete holding a trophy in an arena filled with cheering fans",
  "A bitcoin race car driving around a race track at the bottom of a volcano in the style of Tom Jung art",
  "1980s movie poster with a volcano and race track",
  "Triceratops eating durian mooncake, in a modern photorealistic style",
];

const DEFAULT_ORDER_STATUS = "Order received! Waiting for payment...";

export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://api.micropay.ai";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    // backgroundColor: "#7B1AF7",
  },
}));

const Home: NextPage = () => {
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [invoice, setInvoice] = useState<DalleResponse>();
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
  const [snackOpen, setSnackOpen] = useState<boolean>(false);

  const [showBulkPurchase, setShowBulkPurchase] = useState<boolean>(false);
  const [mockImages, setMockImages] = useState<boolean>(false);
  const [pickNonDalle, setPickNonDalle] = useState<boolean>(false);

  const getCookie = (name: string, cookie: string): string => {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(name + "=[^;]+").exec(cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(
      !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
    );
  };

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
    if (images.length == 4) {
      trackEvent("Conversion: 500 sats", {});
    }

    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [images]);

  const getDalleResponse = async (
    prompt: string
  ): Promise<DalleResponse | null> => {
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

  const trackEvent = (label: string, params: object) => {
    const environment = process.env.NODE_ENV;
    Mixpanel.track(label, {
      ...params,
      environment,
      showTitle,
      errorMessage,
      refundErrorMessage,
      prompt,
      images,
      showRefund,
      progress,
      weblnEnabled,
      serverErrorAlert,
      refundInvoice,
      refundInvoiceSent,
      stopGeneratePolling,
      orderStatus,
      snackOpen,
      showBulkPurchase,
      mockImages,
    });
  };

  const getStatusDalle = async (): Promise<void> => {
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

  const [stableDiffusionId, setStableDiffusionId] = useState<string>("");

  const getStatusStableDiffusion = async (): Promise<void> => {
    const response = await axios.get(
      `${SERVER_URL}/generate/stable-diffusion/${stableDiffusionId}/status`
    );

    const data = response.data;
    setImages(data.images);
    if (data.images.length !== 0) {
      setStopGeneratePolling(true);
    }
  };

  const [remainingCount, setRemainingCount] = useState<number>(0);

  useEffect(() => {
    setRemainingCount(
      3 - (parseInt(getCookie("counter", document.cookie)) || 0)
    );
  }, [stableDiffusionId]);

  const generateStableDiffusion = async () => {
    setImages([]);
    setOrderStatus("Generating 1 Stable Diffusion Image...");
    setStopGeneratePolling(false);
    if (!prompt) {
      setErrorMessage("Please enter a prompt");
    } else if (filter.isProfane(prompt)) {
      setErrorMessage("Please enter a non-profane prompt");
    } else {
      const response = await axios.post(
        `${SERVER_URL}/generate/stable-diffusion`,
        {
          prompt,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setStableDiffusionId(data.id);
      } else {
        setServerErrorAlert(true);
      }
    }
  };

  useInterval(
    async () => {
      if (invoice && images.length === 0) {
        await getStatusDalle();
      }
      if (stableDiffusionId && images.length === 0) {
        await getStatusStableDiffusion();
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
    setSnackOpen(false);
  };

  const largeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const generateButtonHandler = async () => {
    // let flagged = { data: false };
    // try {
    //   flagged = await axios.post(`${SERVER_URL}/check-prompt`, { prompt });
    // } catch (e) {
    //   setErrorMessage(
    //     "checking for prompt flagging failed, continuing without..."
    //   );
    //   //implement a blocking sleep for 2 seconds
    //   await new Promise((r) => setTimeout(r, 2000));
    // }
    if (!prompt) {
      setErrorMessage("Please enter a prompt");
    } else if (filter.isProfane(prompt)) {
      setErrorMessage("Please enter a non-profane prompt");
    } else {
      setShowTitle(false);
      setImages([]);
      setOrderStatus(DEFAULT_ORDER_STATUS);
      setStopGeneratePolling(false);
      setProgress(20);
      const invoice = await getDalleResponse(prompt);
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

  const reset = () => {
    setImages([]);
    setInvoice(undefined);
    setOrderStatus(DEFAULT_ORDER_STATUS);
    setStopGeneratePolling(false);
    setProgress(20);
    setPrompt("");
    setShowTitle(true);
    setImages([]);
    setStableDiffusionId("");
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
        <title>Dalle-2 Image Generator | micropay</title>
        <meta name="title" content="Dalle-2 Image Generator | micropay" />

        <meta
          name="description"
          content="Anonymous and pay-as-you-go generative AI software"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://micropay.ai/" />
        <meta
          property="og:title"
          content="Dalle-2 Image Generator | micropay"
        />
        <meta
          property="og:description"
          content="Anonymous and pay-as-you-go generative AI software"
        />
        <meta
          property="og:image"
          content="https://micropay.ai/micropay-preview.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://micropay.ai/" />
        <meta
          property="twitter:title"
          content="Dalle-2 Image Generator | micropay"
        />
        <meta
          property="twitter:description"
          content="Anonymous and pay-as-you-go generative AI software"
        />
        <meta
          property="twitter:image"
          content="https://micropay.ai/micropay-preview.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

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
                      style={{ width: "19%", paddingTop: "2px" }}
                      src="./micro.png"
                      alt=""
                    />
                    <h1 className={styles.title} style={{ marginLeft: "6px" }}>
                      Dalle-2 Image Generator
                    </h1>
                  </div>
                </a>
                {/* <p style={{ margin: "auto", fontSize: "20px" }}>
                  With Facial Restoration
                </p> */}
              </>
            )}

            {!invoice && !stableDiffusionId && showTitle && (
              <>
                <TextField
                  error={!!errorMessage && images.length === 0}
                  helperText={errorMessage}
                  disabled
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
                              trackEvent("Click: Surprise Me", {});
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
                    trackEvent("Click: Prompt TextField", {});
                  }}
                  onBlur={() => {
                    setPromptPressed(false);
                    trackEvent("Click: Prompt TextField Blur", {});
                  }}
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
                        disabled
                        color="primary"
                        loading={invoice && images.length === 0 && !showRefund}
                        // loadingIndicator="Waiting for payment…"
                        loadingPosition="center"
                        onClick={() => {
                          generateButtonHandler();
                          trackEvent("Click: Dalle ($0.16)", {});
                        }}
                      >
                        Dalle ($0.16)
                      </LoadingButton>
                    </StyledBadge>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    {/* Get the counter value from document.cookie and display as text */}
                    <StyledBadge
                      badgeContent={`${remainingCount}/3`}
                      color={
                        remainingCount <= 0
                          ? "error"
                          : remainingCount === 1
                          ? "warning"
                          : "success"
                      }
                      style={{ width: "100%" }}
                    >
                      <Tooltip
                        title={
                          remainingCount === 0
                            ? "You have run out of free credits"
                            : "Generate a free image"
                        }
                        placement="top"
                      >
                        <span style={{ width: "100%" }}>
                          <LoadingButton
                            variant="contained"
                            style={{
                              width: "100%",
                              backgroundColor: grey[200],
                              textDecoration:
                                remainingCount === 0 ? "line-through" : "none",
                              // textDecorationColor: "grey",
                            }}
                            disabled
                            // disabled={remainingCount === 0}
                            loading={
                              invoice && images.length === 0 && !showRefund
                            }
                            // loadingIndicator="Waiting for payment…"
                            loadingPosition="center"
                            onClick={() => {
                              generateStableDiffusion();
                              setPickNonDalle(true);
                              trackEvent("Click: Non Dalle (FREE)", {});
                            }}
                          >
                            Non Dalle (FREE)
                          </LoadingButton>
                        </span>
                      </Tooltip>
                    </StyledBadge>
                  </Grid>
                  {/* <Grid item xs={6} sm={6}>
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
                        onClick={() => {
                          setShowBulkPurchase(!showBulkPurchase);
                          trackEvent("Click: Bulk Purchase", {});
                        }}
                      >
                        Bulk Purchase
                      </LoadingButton>
                    </Tooltip>
                  </Grid> */}
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
                  {/* <Grid item xs={3} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      style={{ color: "red", borderColor: "red" }}
                      onClick={() => {
                        window.open("https://reddit.com/r/micropay", "_blank");
                        trackEvent("Click: Join Reddit", {});
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
                        trackEvent("Click: Join Telegram", {});
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
                      style={{ color: "#1DA1F2", borderColor: "#1DA1F2" }}
                      onClick={() => {
                        window.open("https://twitter.com/micropay_ai");
                        trackEvent("Click: Follow Twitter", {});
                      }}
                      startIcon={<TwitterIcon style={{ color: "#1DA1F2" }} />}
                    >
                      FOLLOW
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      onClick={() => {
                        window.open("https://calendly.com/micropay/");
                        trackEvent("Click: Call Us", {});
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
                  </Grid> */}
                </Grid>
              </>
            )}

            {!invoice && !showTitle && !pickNonDalle ? (
              <Skeleton
                style={{ width: "100%", height: "75vh" }}
                animation="wave"
              />
            ) : (
              invoice &&
              images.length === 0 &&
              !showRefund && (
                <>
                  <Typography
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      margin: "0",
                    }}
                  >
                    We accept Bitcoin on Lightning ⚡️
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "bold",
                      margin: "0",
                    }}
                  >
                    Cost: 500 satoshis
                  </Typography>
                  <Box sx={{ width: "100%" }}>
                    <Divider style={{ margin: "10px 0" }} />
                    <Typography variant="subtitle1" align="center">
                      <strong>Status:</strong> {orderStatus}
                    </Typography>
                    <LinearProgress
                      style={{ margin: "10px 0" }}
                      variant="determinate"
                      value={progress}
                    />

                    <Typography variant="subtitle1" align="center">
                      Problems? Message us on{" "}
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
                    <Divider style={{ margin: "10px 0" }} />
                  </Box>

                  <Grid
                    container
                    spacing={0}
                    direction="row"
                    textAlign={"center"}
                    justifyContent="center"
                    style={{ marginTop: "-7px" }}
                    className="button-container"
                  >
                    <Grid container xs>
                      <Grid
                        item
                        xs={12}
                        display="flex"
                        justifyContent={"center"}
                        alignItems="center"
                      >
                        <Grid item xs={3}>
                          <Typography variant="h6">STEP 0</Typography>
                        </Grid>
                        <Grid item xs={9} direction="column">
                          <Grid item xs={12} sm={12} md={12}>
                            <Button
                              style={{
                                margin: "10px auto",
                                width: "100%",
                                fontSize: "0.8rem",
                              }}
                              variant="outlined"
                              color="secondary"
                              onClick={() => {
                                window.open("/how-to-use", "_blank");
                                trackEvent("Click: Learn How This Works", {});
                              }}
                              startIcon={<QuestionMarkIcon />}
                            >
                              Learn how this works
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        display="flex"
                        justifyContent={"center"}
                        alignItems="center"
                      >
                        <Grid item xs={3}>
                          <Typography variant="h6">STEP 1</Typography>
                        </Grid>
                        <Grid item xs={9} direction="column">
                          <Grid item xs={12} sm={12} md={12}>
                            <TextField
                              id="outlined-read-only-input"
                              fullWidth
                              label=""
                              defaultValue={invoice?.request}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <Button
                              style={{ margin: "10px auto", width: "100%" }}
                              variant="outlined"
                              onClick={() => {
                                setSnackOpen(true);
                                navigator.clipboard.writeText(invoice?.request);
                                trackEvent("Click: Copy Invoice", {
                                  ...invoice,
                                });
                              }}
                              startIcon={<ContentCopyIcon />}
                            >
                              Copy invoice
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        display="flex"
                        justifyContent={"center"}
                        alignItems="center"
                      >
                        <Grid item xs={3}>
                          <Typography variant="h6">STEP 2</Typography>
                        </Grid>
                        <Grid item xs={9} direction="column">
                          <Grid container>
                            <Grid item xs={12} sm={12} md={12}>
                              <CashappModal trackEvent={trackEvent} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                              <StrikeMeModal trackEvent={trackEvent} />
                            </Grid>

                            <Grid item xs={12} md={12}>
                              {/* <Divider style={{ margin: "16px 0" }} /> */}
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
                                  trackEvent("Click: Open Lightning App", {});
                                }}
                              >
                                Open Lightning App
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container id="qr-code" xs={5}>
                      <Grid
                        item
                        justifyContent={"center"}
                        alignItems="center"
                        display={"flex"}
                        flexDirection="row"
                      >
                        <Divider orientation="vertical">OR</Divider>
                        {/* <Typography variant="h6">OR</Typography> */}

                        <div style={{ paddingLeft: "8px" }}>
                          <QRCodeSVG
                            style={{
                              width: "100%",
                              alignSelf: "center",
                            }}
                            width={200}
                            height={200}
                            onClick={() => {
                              window.open(`lightning:${invoice?.request}`);
                              trackEvent("Click: QR Code", {});
                            }}
                            value={invoice?.request || ""}
                          />
                          <span>Scan QR Code</span>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>

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
                      trackEvent("Click: Go Back", {});
                    }}
                  >
                    Go Back
                  </Button>

                  <Snackbar
                    open={snackOpen}
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
              )
            )}

            {!stableDiffusionId && !showTitle && pickNonDalle ? (
              <Skeleton
                style={{ width: "100%", height: "75vh" }}
                animation="wave"
              />
            ) : (
              stableDiffusionId &&
              images.length === 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    style={{
                      fontWeight: "bold",
                      paddingLeft: "8%",
                      paddingRight: "8%",
                    }}
                  >
                    Your 1 free generation is being processed with Stable
                    Diffusion
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    style={{
                      fontWeight: "bold",
                      paddingLeft: "8%",
                      paddingRight: "8%",
                    }}
                  >
                    Note: The Dalle-2 version includes 4 images per generation
                  </Typography>

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
                    open={snackOpen}
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
              )
            )}
            {images.length > 0 && (
              <>
                <Container style={{ padding: "0px" }}>
                  <Alert
                    severity="success"
                    sx={{ fontSize: "0.85rem", width: "100%" }}
                  >
                    <AlertTitle>Success</AlertTitle>
                    Please download images before clicking off!
                  </Alert>
                </Container>
                <Typography>
                  <strong>Prompt: </strong> {prompt}
                </Typography>

                <ImageList sx={{ width: "100%" }} cols={images.length}>
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
                                trackEvent("Click: Download Single Image", {});
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
                  <Grid item xs={12} md={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      style={{
                        color: "#000000",

                        borderColor: "#000000",
                        fontSize: "0.79rem",
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
                            `images - ${prompt
                              .substring(0, 30)
                              .toLowerCase()}.zip`
                          );
                        });
                        trackEvent("Click: Download All", {});
                      }}
                    >
                      Download All
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="medium"
                      style={{
                        color: "#7b1af7",
                        borderColor: "#7b1af7",

                        fontSize: "0.79rem",
                      }}
                      startIcon={<BrushIcon />}
                      onClick={async () => {
                        reset();
                        trackEvent("Click: Create More", {});
                      }}
                    >
                      CREATE ANOTHER
                    </Button>
                  </Grid>
                </Grid>
                <Feedback
                  id={invoice?.uuid || stableDiffusionId}
                  trackEvent={trackEvent}
                />
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
