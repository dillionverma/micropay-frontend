import { LoadingButton } from "@mui/lab";
import {
  Box,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Slider,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import axios from "axios";
import { Lsat } from "lsat-js";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { requestProvider } from "webln";
import { SERVER_URL } from "..";
import { setQuantity } from "../../store/appSlice";
import { useAppDispatch } from "../../store/hooks";
import SatoshiIcon from "../assets/satoshi.svg";

const SATOSHI_PER_BTC = 100000000;
const MAX_UNITS = 20;

const UNIT_PRICE_MAP: { [key: number]: number } = {
  1: 1000,
  2: 2000,
  3: 3000,
  4: 4000,
  5: 5000,
  6: 6000,
  7: 7000,
  8: 8000,
  9: 9000,
  10: 10000,
  11: 11000,
  12: 12000,
  13: 13000,
  14: 14000,
  15: 15000,
  16: 16000,
  17: 17000,
  18: 18000,
  19: 19000,
  20: 20000,
};

const DISCOUNT_MAP: { [key: number]: number } = {
  1: 0,
  2: 0.02,
  3: 0.03,
  4: 0.04,
  5: 0.05,
  6: 0.06,
  7: 0.07,
  8: 0.08,
  9: 0.09,
  10: 0.1,
  11: 0.11,
  12: 0.12,
  13: 0.13,
  14: 0.14,
  15: 0.15,
  16: 0.16,
  17: 0.17,
  18: 0.18,
  19: 0.19,
  20: 0.2,
};

const UNIT_MARKS: { value: number; label: string }[] = [
  { value: 1, label: "1" },
  { value: 2, label: "" },
  { value: 3, label: "" },
  { value: 4, label: "" },
  { value: 5, label: "5" },
  { value: 6, label: "" },
  { value: 7, label: "" },
  { value: 8, label: "" },
  { value: 9, label: "" },
  { value: 10, label: "10" },
  { value: 11, label: "" },
  { value: 12, label: "" },
  { value: 13, label: "" },
  { value: 14, label: "" },
  { value: 15, label: "" },
  { value: 16, label: "" },
  { value: 17, label: "" },
  { value: 18, label: "" },
  { value: 19, label: "" },
  { value: 20, label: "20" },
];

const formatNumberUSD = (num: number) => {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    // currencySign: false,
  });
};

const formatNumber = (num: number) => {
  return num.toLocaleString("en-US");
};

type LSATResponse = {
  amount: number;
  createdAt: string;
  id: string;
  payreq: string;
};

export const UnitSlider = ({ style }) => {
  // when componenet starts then fetch latest bitcoin price from coindesk and store as a variable in state
  useEffect(() => {
    // fetch bitcoin price from coindesk
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((res) => {
        setPrice(res.data.bpi.USD.rate_float);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [units, setUnits] = useState(1);
  const [invoice, setInvoice] = useState<string>();
  const [invoiceId, setInvoiceId] = useState("");
  const [lsat, setLsat] = useState<Lsat>();

  const dispatch = useAppDispatch();

  const getPriceDollars = (satoshis: number) => {
    return (satoshis * price) / SATOSHI_PER_BTC;
  };

  const getPriceSats = (units: number) => {
    return UNIT_PRICE_MAP[units];
  };

  const getDiscountSats = (units: number) => {
    return DISCOUNT_MAP[units] * getPriceSats(units);
  };

  const getDiscountPercent = (units: number) => {
    return DISCOUNT_MAP[units] * 100;
  };

  const getFinalPriceSats = (units: number) => {
    return getPriceSats(units) - getDiscountSats(units);
  };

  const handleUnitChange = (event: any, newValue: number | number[]) => {
    setUnits(newValue as number);
    setInvoice(undefined);
  };

  useEffect(() => {
    const header =
      'LSAT macaroon="AgEJbG9jYWxob3N0AoQBMDAwMDYzMTAzYzAwNWI5NmI4NGM2NmM3YjgyMDQzMDg4ZmFjNmZmNDY2M2U5ZmI4NGYzZDYxNTVhNmQzOTExN2ZmYWRhZjUxZWQ3NDEyNmNlMWYyOTcwYjkwMzc3Y2UxNTc0MjlkNjkwNjE5ZjcwZWIzMTkzMzZhMmJkMDVlMjQxMTg5AAAGICIuae-XcseO0shZFuEUmulfIIqDcT7t3t1UMFmthmwT", invoice="lnbc100n1p34mxy8pp5vvgrcqzmj6uycek8hqsyxzy043hlge37n7uy70tp2knd8yghl7ksdqqcqzpgxq92fjuqsp5m9fv7d5ee8mvy9npr0lq85cg864ju8hqfvxpna0z9hu567jg5j9s9qyyssqkz3p7pzwh50t28c8jlzdv0grp02thatkh3a76zg324mzd4487tqkvlscpx2a9quhyzzkmd22jh8vn482d5ex2ra7zvkvtwqgyu3ky9sq04vpyp"';
    const l = Lsat.fromHeader(header);

    console.log("HEADER CHECK", l);
  }, []);

  // Restore LSAT from local storage on first mount
  useEffect(() => {
    console.log("Retrieving LSAT from local storage");
    // Retrieve LSAT from local storage
    const lsatToken = localStorage.getItem("lsat");

    console.log("found lsat", lsatToken);

    if (!lsatToken) return;

    console.log("parsing lsat", lsatToken);

    try {
      console.log("LSAT TOKEN", lsatToken);
      const l = Lsat.fromToken(lsatToken, invoice);
      setLsat(l);
      console.log("LSAT retrieved from local storage!");
    } catch (e) {
      console.log("LSAT not found in local storage");
      console.error(e);
      localStorage.removeItem("lsat");
    }
  }, []);

  // Save lsat to local storage whenever it is updated
  useEffect(() => {
    if (lsat) localStorage.setItem("lsat", lsat.toToken());
  }, [lsat]);

  const confirmPayment = async (lsat: Lsat) => {
    setLoading(true);
    let amount = getFinalPriceSats(units);
    const res = await axios.post(
      `${SERVER_URL}/api/v1/bulk`,
      {
        amount,
        quantity: units,
      },
      {
        headers: {
          Authorization: lsat?.toToken() || "",
        },
        validateStatus: () => true,
      }
    );

    dispatch(setQuantity(res.data.quantity));
    setLoading(false);
  };

  // Purchase bulk units
  const bulkPurchase = async () => {
    if (lsat) return lsat;
    setLoading(true);

    let amount = getFinalPriceSats(units);

    // Decrease amount for development environment
    // if (process.env.NODE_ENV !== "production") amount /= 100;

    const res = await axios.post(
      `${SERVER_URL}/api/v1/bulk`,
      {
        amount,
        quantity: units,
      },
      {
        validateStatus: () => true,
      }
    );
    setLoading(false);

    console.log(res);
    // Extract LSAT from response
    const header = res.headers["www-authenticate"];
    const lsatNew = Lsat.fromHeader(header);

    setInvoice(lsatNew.invoice);
    setInvoiceId(lsatNew.paymentHash);
    return lsatNew;
  };

  const onPurchase = async () => {
    const l = await bulkPurchase();
    await confirmPayment(l);

    if (l.isSatisfied()) {
      console.log(l.toJSON());
      alert("Valid lsat");
      return;
    }

    try {
      const webln = await requestProvider();
      const { preimage } = await webln.sendPayment(l.invoice);
      console.log("Success! preimage", preimage);
      l.setPreimage(preimage);
      setLsat(l);
      await confirmPayment(l);
    } catch (err) {
      // Tell the user what went wrong
      console.log("err", err);
      console.error(err);
    }
  };

  return (
    <div style={{ ...style, ...{ width: "100%" } }}>
      <Typography>Bulk pricing</Typography>
      <Slider
        aria-label="Units"
        defaultValue={units}
        // getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        value={units}
        onChange={handleUnitChange}
        step={1}
        marks={UNIT_MARKS}
        min={1}
        max={MAX_UNITS}
      />
      <Grid container justifyContent={"center"} spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={1}>
            <Grid item xs={4} md={5}>
              <Box>
                <strong>Subtotal:</strong>
              </Box>
            </Grid>
            <Grid item xs={8} md={7}>
              <Box px={2} style={{ left: -11, position: "relative" }}>
                <SatoshiIcon
                  style={{
                    width: 20,
                    bottom: -5,
                    right: -5,
                    position: "relative",
                  }}
                />
                <span>{formatNumber(getPriceSats(units))}</span>
                <span style={styles.currency}>satoshis</span>
              </Box>
            </Grid>
            <Grid item xs={4} md={5}>
              <Box>
                <strong style={{ color: "green" }}>Discount:</strong>
              </Box>
            </Grid>
            <Grid item xs={8} md={7}>
              <span style={{ color: "green", position: "absolute" }}>-</span>
              <Box px={2} style={{ left: -11, position: "relative" }}>
                <SatoshiIcon
                  style={{
                    color: "green",
                    width: 20,
                    bottom: -5,
                    right: -5,
                    position: "relative",
                  }}
                />
                <span style={{ color: "green" }}>
                  {formatNumber(getDiscountSats(units))}
                </span>
                <span style={{ ...styles.currency, ...{ color: "green" } }}>
                  satoshis
                </span>
                <Chip
                  style={{ marginLeft: 5 }}
                  label={`Save ${formatNumber(getDiscountPercent(units))}%`}
                  color="success"
                  size="small"
                ></Chip>
              </Box>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          <Grid container spacing={1}>
            <Grid item xs={4} md={5}>
              <Box>
                <strong>Total:</strong>
              </Box>
            </Grid>
            <Grid item xs={8} md={7}>
              <Box px={2}>
                <SatoshiIcon
                  style={{
                    width: 20,
                    bottom: -5,
                    right: -5,
                    position: "relative",
                  }}
                />
                <span>{formatNumber(getFinalPriceSats(units))}</span>
                <span style={styles.currency}>satoshis</span>
              </Box>
              <Box px={2}>
                <span>
                  ~{formatNumberUSD(getPriceDollars(getFinalPriceSats(units)))}
                </span>
                <span style={styles.currency}>USD</span>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <LoadingButton
        variant="contained"
        style={{ width: "100%" }}
        color="primary"
        loading={loading}
        // loadingIndicator="Generating invoice..."
        // loadingPosition="center"
        onClick={onPurchase}
      >
        Bulk Purchase
      </LoadingButton>

      {/* <SpanningTable /> */}

      <div>
        {loading && <Skeleton width={200} height="100%" animation="wave" />}
        {!loading && invoice && (
          <QRCodeSVG
            width={200}
            height={200}
            onClick={() => {
              window.open(`lightning:${invoice}`);
            }}
            value={invoice || ""}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  btn: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 40,
    border: "1px solid",
    borderColor: "#000",
    "& > *": {
      fontWeight: "bold",
      textTransform: "none",
    },
    marginRight: 72,
    // [breakpoints.up("sm")]: {
    //   marginRight: "unset",
    // },
  },
  currency: {
    fontSize: 11,
    color: grey[700],
    marginLeft: 5,
  },
  // big: {
  //   // fontSize: 16,
  // },
  // large: {
  //   // fontSize: 24,
  // },
  // mainGrid: {
  //   // [breakpoints.up("sm")]: {
  //   //   flexDirection: "row-reverse",
  //   // },
  // },
};
