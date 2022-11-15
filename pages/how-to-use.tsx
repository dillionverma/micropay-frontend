import { Container, Grid, Tooltip } from "@mui/material";

export default function HowTo() {
  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "100px", textAlign: "center", marginBottom: "10vh" }}
    >
      <h1>How to Use</h1>
      <div className="how-to-use-intro">
        <p style={{ fontSize: "20px" }}>
          This product is a “pay as you go” version of Open AI’s Dalle-2. This
          means you <strong>don't have</strong> to spend $15 for 115 generations
          at a time, and instead purchase one at a time if you would like. Since
          these micropayments are done on the lightning network, this means that
          you must have Cashapp / Strike or a lightning wallet to pay the
          lightning invoices that are served
        </p>
        <br></br>
      </div>

      <h2>Demos Below </h2>

      <Grid container direction="row">
        <Grid className="cashapp-demo" item xs={12} md={4}>
          <img
            src="438r9893urkcks7339cj38.png"
            alt="cashapp"
            className="cashapp"
            height="100px"
          />
          <Tooltip title="Not Available Yet" placement="top">
            <h2 style={{ marginTop: "-1.5vh" }}>Demo</h2>
          </Tooltip>
        </Grid>

        <Grid className="strike-demo" item xs={12} md={4}>
          <img
            src="3488f6cc678b98cb97a9a7a502ce38adab2d9a7ff88c25900f2c79b51ec8df69.png"
            alt="strike-logo"
            className="strike-png"
            height="75"
            style={{ marginTop: "1vh" }}
          />

          <Tooltip title="Not Availabe Yet" placement="top">
            <h2 style={{ marginTop: "0vh" }}>Demo</h2>
          </Tooltip>
        </Grid>

        <Grid className="lightning-wallet-demo" item xs={12} md={4}>
          <img
            src="8395dcb24914bb7f5ee0e94f08d2ddcb0b3b1339ffad4dd50b7c3d3adc65f635.png"
            alt="ln-icon"
            height="30px"
            className="ln-icon"
            style={{ marginTop: "3vh" }}
          />
          <h2 style={{ display: "inline" }}>LN Wallet</h2>
          <h2>
            <a
              href="https://twitter.com/dillionverma/status/1567508869944938503"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#229ED9" }}
            >
              Demo
            </a>
          </h2>
        </Grid>
      </Grid>
      <Grid md={12}>
        <br></br>
        <h2>See Below for more Info</h2>
        <p style={{ fontSize: "20px", marginTop: "-5px" }}>
          How to use your
          <a
            href="https://youtu.be/Cfc3JGb3a4g?t=492"
            style={{ color: "#229ED9" }}
          >
            {" "}
            Bitcoin on the Lightning Network
          </a>
        </p>
        <p style={{ fontSize: "20px", marginTop: "-5px" }}>
          How to Convert
          <a href="https://youtu.be/LxkrUvrfNAI" style={{ color: "#229ED9" }}>
            {" "}
            Altcoins to Bitcoin{" "}
          </a>
        </p>
        <p style={{ fontSize: "20px", marginTop: "-5px" }}>
          How to
          <a
            href="https://www.youtube.com/watch?v=Yy_R2C0tpqU"
            style={{ color: "#229ED9" }}
          >
            {" "}
            Buy Bitcoin{" "}
          </a>
        </p>
      </Grid>
    </Container>
  );
}
