import type { AppProps } from "next/app";
import Layout from "../src/components/layout";
import "../styles/globals.css";

import { blue } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#7B1AF7",
    },
    secondary: {
      main: blue[600],
    },
    mode: "light",
  },
});

const commonLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;

function MyApp({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || commonLayout;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}

export default MyApp;
