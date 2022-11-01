export default function HowTo() {
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
        <h1>How to Use</h1>
      </div>
      <div
        style={{
          textAlign: "center",
          marginLeft: "33%",
          marginRight: "33%",
          paddingBottom: "10%",
        }}
      >
        <div className="lightning-wallet">
          {/* <h2>If you have a 💳 Lightning Wallet</h2> */}
          <p>
            See demo on{" "}
            <a
              href="https://twitter.com/dillionverma/status/1567508869944938503"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#229ED9" }}
            >
              how to use this app on your phone
            </a>
          </p>
          <p></p>
          <p>
            See demo on{" "}
            <a
              href="https://twitter.com/dillionverma/status/1585762312610353153"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#229ED9" }}
            >
              how to use this app on the desktop
            </a>
          </p>
        </div>

        {/* <div className="cashapp-strike">
          <h2>If you have 💰 Cash App or Strike</h2>
          <p>
            See demo on{" "}
            <a
              href="https://twitter.com/dillionverma/status/1567508869944938503"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#229ED9" }}
            >
              how to use this app on your phone
            </a>
          </p>
          <p></p>
          <p>
            See demo on{" "}
            <a
              href="https://twitter.com/dillionverma/status/1585762312610353153"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#229ED9" }}
            >
              how to use this app on the desktop
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
