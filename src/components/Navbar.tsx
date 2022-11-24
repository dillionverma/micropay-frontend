import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Mixpanel } from "../mixpanel";

const navItems = [
  // {
  //   name: "About",
  //   link: "/about",
  // },
  { name: "How to Use", link: "/how-to-use" },
];

export default function DrawerAppBar() {
  return (
    <>
      {/* <Alert
        variant="filled"
        severity="success"
        style={{
          justifyContent: "center",
          backgroundColor: "#7b1af7",
          fontSize: "1.00rem",
        }}
        icon={false}
      >
        🎉 We&apos;re live on{" "}
        <a
          href="https://www.producthunt.com/posts/micro-dalle-2"
          style={{
            color: "white",
            textDecoration: "underline",
          }}
          target="_blank"
          rel="noreferrer"
        >
          ProductHunt
        </a>{" "}
        right now 🎉
      </Alert> */}
      <AppBar
        component="nav"
        style={{ backgroundColor: "white", position: "relative" }}
        elevation={0}
        // variant="outlined"
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { sm: "block" } }}
          >
            <a
              href="/"
              onClick={() =>
                Mixpanel.track("Click: µ", {
                  environment: process.env.NODE_ENV,
                })
              }
            >
              <img
                src="/apple-icon.png"
                alt="Micropay Logo"
                style={{
                  display: "flex",
                  width: "70px",
                  height: "auto",
                  cursor: "pointer",
                }}
              />
            </a>
          </Typography>
          <Box sx={{ display: { sm: "block" } }}>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  Mixpanel.track("Click: How to Use", {
                    environment: process.env.NODE_ENV,
                  })
                }
              >
                <Button sx={{ color: "#000" }}>{item.name}</Button>
              </a>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
