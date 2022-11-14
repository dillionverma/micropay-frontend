import { Container, Grid } from "@mui/material";

export default function About() {
  return (
    <>
      <Container
        maxWidth="md"
        style={{
          marginTop: "100px",
          textAlign: "center",
          marginBottom: "10vh",
        }}
      >
        <Grid item md={12}>
          <Grid item md={12}>
            <h1> About </h1>
            <img
              src="8b127d0ebb5d-0b9052da2e6a.jpeg"
              alt="Dillion"
              className="dillion"
              width="250px"
              style={{ marginLeft: "2%", marginRight: "2%" }}
            />
            <img
              src="6ff6005b63b85066a648eff4db3ea42671caa3986b2a8e7729da8073c4a7ef04.png"
              alt=""
              className="haseab"
              width="250px"
              style={{ marginLeft: "2%", marginRight: "2%" }}
            />
          </Grid>
          <Grid item md={12}>
            <p>
              Micropay was founded by{" "}
              <a
                href="https://twitter.com/dillionverma"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#229ED9" }}
              >
                Dillion
              </a>
              {" and "}
              <a
                href="https://twitter.com/haseabamin"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#229ED9" }}
              >
                Haseab
              </a>
              . We started as an alternative to bulk purchasing credits in order
              to pay for Dalle-2, which is OpenAI's text to image generator.
            </p>
            <p>
              And so we devised the same text to image generator product, but it
              was anonymous, and it would allow the user to never pay more than
              what they used. Think of a vending machine, but for software.
            </p>
            <p>
              The reason why we were able to implement this is because of the
              Lightning Network, which a technology built on Bitcoin which
              allows for instant, low-fee microtransactions at scale.
              Traditional credit card fees can’t handle microtransactions due to
              their high fees, but with the lightning network, this is
              effortlessly done.
            </p>
            {/* <p>
          We envision making an array of tools for small businesses, making it
          easier for them to get off the ground by making it anonymous, low
          friction and pay per use.
        </p> */}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
