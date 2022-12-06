import { ReactElement } from "react";

const Dev = () => {
  return (
    <>
      <iframe
        id="micropay-iframe"
        src="https://micropay-dev.framer.website/"
        frameBorder="0"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          position: "fixed",
          top: 0,
        }}
      ></iframe>
    </>
  );
};

Dev.getLayout = (page: ReactElement) => <>{page}</>;

export default Dev;
