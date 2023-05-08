import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Link from "@mui/material/Link";

const FAQ = () => (
  <Stack style={{ marginTop: "50px" }}>
    <Typography style={{ marginBottom: "20px" }} variant="h4" align="center">
      Frequently asked questions (FAQ)
    </Typography>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography>How do I use this?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          1. Download a wallet which supports the lightning network i.e{" "}
          <Link target="_blank" rel="noopener" href="https://phoenix.acinq.co/">
            pheonix wallet
          </Link>{" "}
          or{" "}
          <Link target="_blank" rel="noopener" href="https://bluewallet.io/">
            blue wallet
          </Link>{" "}
          or{" "}
          <Link target="_blank" rel="noopener" href="https://muun.com/">
            muun wallet
          </Link>
          .
        </Typography>
        <Typography>
          2. Acquire some satoshis (the currency of the lightning network).
        </Typography>
        <Typography style={{ marginLeft: "10px" }}>
          1 satoshi = 0.00000001 BTC
        </Typography>
        <Typography style={{ marginLeft: "10px" }}>
          500 satoshi = 0.000005 BTC
        </Typography>
        <Typography style={{ marginLeft: "10px" }}>
          500 satoshi = ~$0.14 USD
        </Typography>
        <Typography>3. Scan the above invoice and pay!</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>I paid but I don&apos;t see my images?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          If you did not recieve your images after 30 seconds, it is likely that
          the request failed. Please share your invoice request to this{" "}
          <a
            href="https://forms.gle/c2tGbDJ2Hg9jvVbF9"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(103, 58, 183)" }}
          >
            form
          </a>{" "}
          along with your contact information and we can take a look and process
          a refund.
        </Typography>

        <Typography>
          If your request contained any profane language or reference to sexual
          content we will not be offering any refunds as it violates the Dalle-2
          terms of use.
        </Typography>
      </AccordionDetails>
    </Accordion>
  </Stack>
);

export default FAQ;
