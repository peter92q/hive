import {
    Alert,
    CircularProgress,
    ClickAwayListener,
    Slide,
    Snackbar,
    TextareaAutosize,
  } from "@mui/material";
  import React, { SetStateAction, useState } from "react";
  import axios from "axios";
  import SendIcon from "@mui/icons-material/Send";
  import CloseIcon from '@mui/icons-material/Close';
  import { styles } from "./MessageWindowStyles";
  
  export default function MessageWindow({
    open,
    setOpen,
    id,
  }: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    id: string | null;
  }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [snack, setSnack] = useState<boolean>(false);

    const SubmitMessage = async (event: any) => {
      event.preventDefault();
      setLoading(true);
      const text = event.target.text.value;
      const response = await axios.post("http://localhost:5001/api/Message", {
        recipientId: id && id,
        content: text,
      });
      event.target.text.value = null;
      console.log(response.data);
      setLoading(false);
      setSnack(true);
    };
     
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        document.getElementById("submitBtn")!.click();
      }
    };

    return (
      <>
        {open && (
          <ClickAwayListener onClickAway={() => setOpen((prev) => !prev)}>
            <Slide direction="down" in={open} timeout={400} unmountOnExit>
              <form
                onSubmit={SubmitMessage}
                className={styles.formContainer}
              >
            <div className={styles.closeIconWrapper}
            >  
             <CloseIcon 
               onClick={() => setOpen((prev) => !prev)}
               sx={{fill:"white", fontSize:20}}
               className={styles.closeIcon}
             />
           </div>
                <TextareaAutosize
                  minRows={4}
                  maxRows={10}
                  placeholder="Write a message..."
                  id="text"
                  name="text"
                  onKeyDown={handleKeyDown}
                  className={styles.textArea}
                />
                <div className={styles.sendWrapper}>
                  <button id="submitBtn" type="submit" className="hidden">
                    SEND
                  </button>
                  {loading ? (
                    <CircularProgress
                      sx={{ fill: "black", fontSize: 30 }}
                      className={styles.iconStyle}
                    />
                  ) : (
                    <SendIcon
                      sx={{ fill: "black", fontSize: 30 }}
                      onClick={() =>
                        document.getElementById("submitBtn")!.click()
                      }
                      className={styles.iconStyle}
                    />
                  )}
                </div>
                <Snackbar open={snack} autoHideDuration={2000} onClose={()=>setSnack(false)}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        Message sent!
                    </Alert>
                </Snackbar> 
              </form>
            </Slide>
          </ClickAwayListener>
        )}
      </>
    );
  }
  