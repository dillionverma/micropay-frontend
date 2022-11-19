import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { CashappIcon } from "../../src/assets/icons/icons";

export default function CashappModal() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div>
      <Button
        variant="outlined"
        style={{
          color: "#00D632",
          borderColor: "#00D632",
          width: "100%",
          margin: "0px 0",
        }}
        onClick={() => {
          setModalOpen(true);
        }}
        startIcon={<CashappIcon />}
      >
        Open Cash App
      </Button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "auto%",
            bgcolor: "background.paper",
            p: 4,
            maxWidth: "sm",
          }}
        >
          <Box display="flex" justifyContent="center">
            <Typography
              id="modal-modal-title"
              fontSize="1.5rem"
              sx={{ alignText: "center" }}
            >
              <strong>How to Use Cashapp</strong>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            <img
              src="paying-lightning.gif"
              alt="cashapp"
              style={{ maxWidth: "85%" }}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              style={{
                color: "black",
                borderColor: "black",
                marginTop: "10px",
              }}
              onClick={() => {
                window.open("https://cash.app/$", "_blank");
              }}
              startIcon={<CashappIcon />}
            >
              Take Me to Cash App
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
