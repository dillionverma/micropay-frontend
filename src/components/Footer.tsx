import FlashOnIcon from "@mui/icons-material/FlashOn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Alert, Grid, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/Home.module.css";

export default function Footer() {
  const [open, setOpen] = useState(false);

  const nodeAddress =
    "031f4cf2aee504680226af773429181549bf91b87db334c7334e4ae0f26d354407@5drnrrfwo6spex3b5dzmw4n4pprp5su7bvmy526nbeehwqyv5yyx36id.onion:9735";

  const handleNodeClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(nodeAddress);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const truncate = (str: string, n: number, separator: string = " ... ") => {
    if (str.length <= n) return str;

    separator = separator || "...";

    var sepLen = separator.length,
      charsToShow = n - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

    return (
      str.substr(0, frontChars) + separator + str.substr(str.length - backChars)
    );
  };

  return (
    <>
      <footer className={styles.footer}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Grid
            item
            xs={12}
            sm={3}
            flexDirection="row"
            style={{ paddingBottom: "16px" }}
          >
            <Link href="/">
              <img
                src="/micropay.png"
                alt="Micropay Logo"
                className={styles.logo}
              />
            </Link>
            <a
              href="https://t.me/+zGVesHQRbl04NTA5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TelegramIcon sx={{ color: "#229ED9" }} />
            </a>
            <a
              href="https://twitter.com/micropay_ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon sx={{ color: "#00acee" }} />
            </a>
            <a
              href="https://github.com/micropayai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon sx={{ color: "#333" }} />
            </a>
            <a
              href="https://www.linkedin.com/company/micropay-ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon sx={{ color: "#0072b1" }} />
            </a>
            <a
              href="https://makers.bolt.fun/project/micropay"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FlashOnIcon sx={{ color: "rgb(123 97 255)" }} />
            </a>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            flexDirection="column"
            display={"flex"}
            style={{ paddingBottom: "16px" }}
          >
            <a
              href="https://micropay.canny.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Public Roadmap
            </a>

            <a
              href="https://micropay.instatus.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Status Page
            </a>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            flexDirection="column"
            display={"flex"}
            style={{ paddingBottom: "16px" }}
          >
            <Link href="/about">About</Link>
            <Link href="/how-to-use">How to use</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            {/* <Typography variant="subtitle1" align="center">
              Made with ❤️ by
              <a
                href="https://twitter.com/dillionverma"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#229ED9" }}
              >
                Dillion
              </a>
              and
              <a
                href="https://twitter.com/haseabamin"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#229ED9" }}
              >
                Haseab
              </a>
            </Typography>
            <a
              href="https://lightning.network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{" "}
              <div style={{ display: "inline-flex" }}>
                <Image
                  className={styles.icon}
                  src="/bitcoin.svg"
                  alt="Vercel Logo"
                  width={20}
                  height={20}
                />
                <Image
                  className={styles.icon}
                  src="/lightning.svg"
                  alt="Vercel Logo"
                  width={20}
                  height={20}
                />
              </div>
            </a> */}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            flexDirection="row"
            display={"flex"}
            alignItems="center"
            justifyContent="center"
            // variant="outline"
            style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ cursor: "pointer", padding: "0 4px" }}
              onClick={() => {
                handleNodeClick();
              }}
            >
              Connect with us:
            </Typography>
            <p
              style={{ cursor: "pointer", margin: 0, fontWeight: "bold" }}
              onClick={() => {
                handleNodeClick();
              }}
            >
              {truncate(nodeAddress, 30)}
            </p>

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

            {/* MUI textfield */}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            flexDirection="column"
            display={"flex"}
            alignItems="center"
            justifyContent="center"
            // variant="outline"
            style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
          >
            <Typography variant="subtitle1" align="center">
              Made with ❤️ by
              <a
                href="https://twitter.com/dillionverma"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#229ED9" }}
              >
                Dillion
              </a>
              and
              <a
                href="https://twitter.com/haseabamin"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#229ED9" }}
              >
                Haseab.
              </a>
              <a
                href="https://lightning.network/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by{" "}
                <div
                  style={{
                    display: "inline-flex",
                    position: "relative",
                    top: "3px",
                  }}
                >
                  <Image
                    className={styles.icon}
                    src="/purple-lightning.png"
                    alt="Vercel Logo"
                    width={20}
                    height={20}
                  />
                </div>
                .
              </a>
            </Typography>
            <Typography variant="subtitle1" align="center" color={"red"}>
              This software has been deprecated as of 2022
            </Typography>
          </Grid>
        </Grid>
      </footer>
    </>
  );
}
