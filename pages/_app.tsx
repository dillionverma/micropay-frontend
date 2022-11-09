import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "../styles/globals.css";
import Layout from "./components/layout";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
