import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

import PhoneIcon from "@mui/icons-material/Phone";
import RedditIcon from "@mui/icons-material/Reddit";
import SendIcon from "@mui/icons-material/Send";
import TelegramIcon from "@mui/icons-material/Telegram";
import { SERVER_URL } from "../../pages";

const Feedback = ({ invoiceId }: { invoiceId: string | undefined }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const sendFeedback = async (
    rating: number,
    feedback: string,
    email: string
  ): Promise<void> => {
    const response = await axios.post(`${SERVER_URL}/feedback`, {
      rating,
      feedback,
      email,
      invoiceId,
    });
  };

  const handleFeedback = async () => {
    await sendFeedback(rating || 0, feedback, email);
    setFeedbackSent(true);
  };

  return (
    <>
      {feedbackSent && (
        <>
          <Alert severity="success">
            Feedback sent! Thank you for your feedback.
          </Alert>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            className="button-container"
            // alignItems={"stretch"}
          >
            <Grid item xs={3} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                size="medium"
                style={{ color: "red", borderColor: "red" }}
                onClick={() => {
                  window.open("https://reddit.com/r/micropay");
                }}
                startIcon={<RedditIcon style={{ color: "red" }} />}
              >
                JOIN
              </Button>
            </Grid>
            <Grid item xs={3} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                size="medium"
                style={{ color: "#2AABEE", borderColor: "#2AABEE" }}
                onClick={() => {
                  window.open("https://t.me/+zGVesHQRbl04NTA5");
                }}
                startIcon={<TelegramIcon style={{ color: "#2AABEE" }} />}
              >
                JOIN
              </Button>
            </Grid>
            <Grid item xs={4} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                size="medium"
                onClick={() => {
                  window.open("https://calendly.com/micropay/");
                }}
                style={{
                  color: "#33cc33",
                  borderColor: "#33cc33",
                  whiteSpace: "nowrap",
                }}
                startIcon={<PhoneIcon style={{ color: "#33cc33" }} />}
              >
                CALL US
              </Button>
            </Grid>
          </Grid>
        </>
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
          <Typography variant="h6" align="center" style={{ fontSize: "25px" }}>
            CRITICIZE US BELOW
          </Typography>

          {/* <StyledRating
            name="highlight-selected-only"
            value={rating}
            onChange={async (event, newValue) => {
              if (newValue) {
                setRating(newValue);
                await sendFeedback(newValue, feedback, email);
              }
            }}
            size="large"
            IconContainerComponent={IconContainer}
            getLabelText={(value: number) => customIcons[value].label}
            highlightSelectedOnly
            style={{
              margin: "10px auto",
            }}
          /> */}
          <Box
            sx={{
              "& > legend": { mt: 2 },
            }}
          >
            <Typography
              component="legend"
              alignItems="center"
              sx={{ fontSize: "0.95rem" }}
            >
              How likely are you to recommend micropay to a friend?
            </Typography>
            <Grid container justifyContent="center">
              <Grid item>
                <Rating
                  name="customized-10"
                  size="medium"
                  value={rating}
                  max={10}
                  sx={{ fontSize: "1.4rem" }}
                  onChange={async (event, newValue) => {
                    if (newValue) {
                      setRating(newValue);
                      await sendFeedback(newValue, feedback, email);
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: "0.95rem" }}>
                  {rating} /10
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <FormControl>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <TextField
                required={true}
                type="text"
                style={{ flex: 1 }}
                error={error}
                fullWidth
                InputLabelProps={{ style: { fontSize: "0.9rem" } }} // font size of input text
                id="feedback"
                label="We want the truth! Tell us your experience"
                onChange={(e) => {
                  setFeedback(e.target.value);
                  if (!!feedback && !!email) {
                    setDisabled(false);
                  }
                }}
              />
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <TextField
                required={true}
                type="text"
                error={error}
                style={{ flex: 1 }}
                fullWidth
                id="feedback"
                label="Enter Your Email"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFeedback();
                  }
                }}
                onChange={(e: any) => {
                  console.log(e);
                  setEmail(e.target.value);
                  if (!!feedback && !!email) {
                    setDisabled(false);
                  }
                }}
              />

              <Button
                style={{ marginLeft: "10px" }}
                disabled={disabled}
                variant="outlined"
                onClick={async () => {
                  if (feedback && email) {
                    handleFeedback();
                  } else {
                    setError(true);
                  }
                }}
                startIcon={<SendIcon />}
              >
                Send
              </Button>
            </div>
          </FormControl>
        </Paper>
      )}
    </>
  );
};

export default Feedback;
