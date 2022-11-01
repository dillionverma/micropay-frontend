import Link from "next/link";

export default function About() {
  return (
    <div
      style={
        {
          // height: "50vh",
          // justifyContent: "center",
          // alignItems: "center",
          // display: "flex",
        }
      }
    >
      <div
        style={{
          marginTop: "8%",
          textAlign: "center",
        }}
      >
        <h1>About</h1>
      </div>
      <div
        style={{ marginLeft: "33%", marginRight: "33%", paddingBottom: "10%" }}
      >
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
          . We started as an alternative to bulk purchasing credits in order to
          pay for Dalle-2, which is OpenAI's text to image generator.
        </p>
        <p>
          And so we devised the same text to image generator product, but it was
          anonymous, and it would allow the user to never pay more than what
          they used. Think of a vending machine, but for software.
        </p>
        <p>
          The reason why we were able to implement this is because of the
          Lightning Network, which a technology built on Bitcoin which allows
          for instant, low-fee microtransactions at scale. Traditional credit
          card fees can’t handle microtransactions due to their high fees, but
          with the lightning network, this is effortlessly done.
        </p>
        {/* <p>
          We envision making an array of tools for small businesses, making it
          easier for them to get off the ground by making it anonymous, low
          friction and pay per use.
        </p> */}
      </div>
    </div>
  );
}
