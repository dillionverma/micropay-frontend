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
              . It started out as a simple solution to a problem we faced once
              we got access to OpenAI's Dalle-2 in late 2022. In order to use
              the text to image generator, we needed to pay $15 for 115 credits
              of use.
            </p>
            <p>
              We decided to solve our problem by creating a wrapper around the
              OpenAI API allowing us to pay-per-use instead of prepaying in
              bulk. Payments were accepted over the lightning network and the
              product is completely anonymous allowing anyone to use it without
              having to sign up. It's like a vending machine, but for software.
            </p>
            <p>
              This solution is unique since traditional credit card providers
              can't handle microtransactions due to their high fees. The
              Lightning Network however, which is a technology built on Bitcoin,
              allows for instant and low-fee microtransactions at scale.
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
