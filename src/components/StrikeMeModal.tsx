import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Container } from "@mui/material";
import {
  CashappIcon,
  LightningIcon,
  StrikeIcon,
} from "../../src/assets/icons/icons";
import { maxHeight } from "@mui/system";

export default function CashappModal() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div>
      <Button
        variant="outlined"
        style={{
          color: "black",
          borderColor: "black",
          width: "100%",
          margin: "0px 0",
        }}
        onClick={() => {
          setModalOpen(true);
        }}
        startIcon={<StrikeIcon />}
      >
        Open Strike.me
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
              <strong>How to Use Strike.me</strong>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            <img
              src="strike-lightning.gif"
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
                window.open("https://strike.me/download/", "_blank");
              }}
              startIcon={<StrikeIcon />}
            >
              Take Me to Strike.me
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}