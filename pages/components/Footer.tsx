import FlashOnIcon from "@mui/icons-material/FlashOn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/Home.module.css";

export default function Footer() {
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
          </Grid>
        </Grid>
      </footer>
    </>
  );
}
