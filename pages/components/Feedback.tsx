import { Alert, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import StyledRating, { customIcons, IconContainer } from "./StyledRating";

import SendIcon from "@mui/icons-material/Send";
import { SERVER_URL } from "..";

const Feedback = ({ invoiceId }: { invoiceId: string | undefined }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  const sendFeedback = async (
    rating: number,
    feedback: string
  ): Promise<void> => {
    const response = await axios.post(`${SERVER_URL}/feedback`, {
      rating,
      feedback,
      invoiceId,
    });
    setFeedbackSent(true);
  };

  return (
    <>
      {feedbackSent && (
        <Alert severity="success">
          Feedback sent! Thank you for your feedback.
        </Alert>
      )}
      {!feedbackSent && (
        <Paper
          variant="outlined"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" align="center">
            How happy are you with the results?
          </Typography>
          <StyledRating
            name="highlight-selected-only"
            value={rating}
            onChange={(event, newValue) => {
              if (newValue) {
                setRating(newValue);
              }
            }}
            size="large"
            IconContainerComponent={IconContainer}
            getLabelText={(value: number) => customIcons[value].label}
            highlightSelectedOnly
            style={{
              margin: "10px auto",
            }}
          />

          <div
            style={{
              flexDirection: "row",
              display: "flex",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <TextField
              type="text"
              style={{ flex: 1 }}
              fullWidth
              id="feedback"
              label="Feedback"
              onChange={(e) => {
                setFeedback(e.target.value);
              }}
            />
            <Button
              style={{ marginLeft: "10px" }}
              variant="outlined"
              onClick={async () => {
                if (feedback) {
                  await sendFeedback(rating || 0, feedback);
                }
              }}
              startIcon={<SendIcon />}
            >
              Send
            </Button>
          </div>
        </Paper>
      )}
    </>
  );
};

export default Feedback;
