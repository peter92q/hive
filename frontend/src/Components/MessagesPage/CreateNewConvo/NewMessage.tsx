import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import SearchUsers from "./Searchbar";
import SendIcon from "@mui/icons-material/Send";
import SnackbarBottomLeft from "./SnackbarBottomLeft";
import { InboxMessageProps } from "../../../Configs/Types/Types";
import { styles } from "./NewMessageStyles";

export default function NewMessage() {
  const [messages, setMessages] = useState<InboxMessageProps[]>([]);
  const [recipient, setRecipient] = useState<string>(""); 
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const SubmitMessage = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const text = event.target.text.value;
    const receiver = recipient;
    const response = await axios.post("http://localhost:5001/api/Message", {
      recipientId: receiver,
      content: text,
    });
    event.target.text.value = null;
    const result = response.data;
    setMessages((prev) => [...prev, result]);
    setLoading(false);
    setOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      document.getElementById("submitBtn")!.click();
    }
  };

  return (
    <form
      onSubmit={SubmitMessage}
      className={styles.mainContainer}
    >    
      <SnackbarBottomLeft open={open} setOpen={setOpen} />
      <div className={styles.newConvoWrapper}>
        <div className={styles.newConvoSubWrapper}>
          New conversation</div>
        <SearchUsers setRecipient={setRecipient} />
      </div>
      <div className={styles.messagesContainer}>
        <div className="w-full h-full ">
          {messages.map((message, index) => (
            <div
              key={index}
              className={styles.messageCardWrapper}
            > 
              <div className={styles.to}>
                <p className="responsive-text2">To: {message.sentBy !== message.userIdA ? message.firstNameUserA : message.firstNameUserB} </p>
                <p className="responsive-text2">{message.timestamp}</p>
              </div>
              <div className={styles.content}>
                <p className="responsive-text3">{message.content}</p>
                <div className="w-[9%]" />
              </div>
            </div>
          ))}
        </div>
        {recipient.length > 0 &&
        <div className={styles.chatContainer}>
          
          <textarea
            placeholder="Write a message..."
            id="text"
            name="text"
            onKeyDown={handleKeyDown}
            className={styles.textarea}
          />

          <div className={styles.sendWrapper}>
            <button id="submitBtn" type="submit" className="hidden">
              SEND
            </button>
            {loading ? (
              <CircularProgress
                sx={{ fill: "black", fontSize: 30 }}
                className={styles.circularProgress}
              />
            ) : (
              <SendIcon
                sx={{ fill: "black", fontSize: 30 }}
                onClick={() => document.getElementById("submitBtn")!.click()}
                className={styles.sendIcon}
              />
            )}
          </div>
        </div>
        }
      </div>
    </form>
  );
}
