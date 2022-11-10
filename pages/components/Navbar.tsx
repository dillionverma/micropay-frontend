import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

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
      <AppBar
        component="nav"
        style={{ backgroundColor: "white", position: "relative" }}
        elevation={0}
        // variant="outlined"
      >
        <Toolbar>
          <Link href="/">
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { sm: "block" } }}
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
            </Typography>
          </Link>
          <Box sx={{ display: { sm: "block" } }}>
            {navItems.map((item) => (
              <Link key={item.name} href={item.link}>
                <Button sx={{ color: "#000" }}>{item.name}</Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
