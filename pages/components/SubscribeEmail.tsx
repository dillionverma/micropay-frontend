import { Alert, AlertTitle, Button, Paper, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import { SERVER_URL } from "..";

const validateEmail = (email: string) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const SubscribeEmail = () => {
  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

  const sendEmail = async (email: string): Promise<void> => {
    const response = await axios.post(`${SERVER_URL}/subscribe`, {
      email,
    });
    setEmailSent(true);
  };

  return (
    <>
      {emailSent && (
        <Alert severity="success">Email sent! Will keep you in touch</Alert>
      )}

      {!emailSent && (
        <Paper variant="outlined" style={{ padding: "20px" }}>
          <Alert severity="info">
            <AlertTitle>Stay up to date</AlertTitle>
            Share your email address to stay up to date about new features
            (optional)
          </Alert>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <TextField
              type="email"
              style={{ flex: 1 }}
              fullWidth
              id="email"
              label="Email"
              error={!!emailErrorMessage}
              helperText={emailErrorMessage}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErrorMessage("");
              }}
            />
            <Button
              style={{ marginLeft: "10px" }}
              variant="outlined"
              onClick={async () => {
                if (email && validateEmail(email)) {
                  await sendEmail(email);
                  setEmailErrorMessage("");
                } else {
                  setEmailErrorMessage("Please enter a valid email");
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

export default SubscribeEmail;
