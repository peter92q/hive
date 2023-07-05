import { SetStateAction, useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import SnackbarBottomLeft from "../CreateNewConvo/SnackbarBottomLeft";
import { ConvoProps, InboxMessageProps } from "../../../Configs/Types/Types";
import ConvoCard from "./ConvoCard";
import MessageCard from "./MessageCard";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TableHeader from "../../../Configs/staticData";
import { styles } from "./InboxStyles"; 

export default function Inbox(
  {
    setHide
  }
  :
  {
    setHide:React.Dispatch<SetStateAction<boolean>>; 
  }
  ) {
  const [_selectedConvo, setSelectedConvo] = useState<number | null>(null);
  const [conversations, setConversations] = useState<ConvoProps[]>([]);
  const [messages, setMessages] = useState<InboxMessageProps[]>([]);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    async function getConvos() {
      const convos = await axios.get(
        "http://localhost:5001/api/Message/allConvos"
      );
      setConversations(convos.data);
    }
    getConvos();
  
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
 
  return (
    <form onSubmit={SubmitMessage} className={styles.formContainer}>
      <SnackbarBottomLeft open={open} setOpen={setOpen} />
      <table className="bg-black w-full mt-2 h-full mx-auto"> 
        {messages.length > 0  
          ? 
          <div className={styles.messagesContainer}>
            <div
              onClick={()=>{setMessages([]); setHide(false)}} 
              className={styles.backIcon}>
               <ArrowBackIosIcon sx={{fill:"white", fontSize:28, cursor: 'pointer', marginBottom:"10px"}}/>
               <p className="cursor-pointer">Back</p>
            </div>
            <div ref={messagesContainerRef} className={styles.messagesSubContainer}>
              {messages.map((message, index) => (
                <MessageCard
                  key={message.messageId}
                  index={index}
                  message={message}
                  setRecipient={setRecipient}
                />
              ))}
            </div>
            {recipient !== null && (
              <div className={styles.messagesWrapper}>
                <textarea
                  placeholder="Write a message..."
                  id="text"
                  name="text"
                  onKeyDown={handleKeyDown}
                  className={styles.textArea}
                />
                <div className={styles.buttonWrapper}>
                  <button id="submitBtn" type="submit" className="hidden">
                    SEND
                  </button>
                  {loading ? (
                    <CircularProgress
                      sx={{ fill: "black", fontSize: 30 }}
                      className={styles.icon}
                    />
                  ) : (
                    <SendIcon
                      sx={{ fill: "black", fontSize: 30, rotate: "-30deg" }}
                      onClick={() => document.getElementById("submitBtn")!.click()}
                      className={styles.icon}
                    />
                  )}
                </div>
              </div>
            )}
            </div> 
          : 
          <div className="md:px-2 px-2">         
          <TableHeader/>
          {conversations && conversations ?  
            conversations.map((convo, index) => (
              <ConvoCard   
                key={convo.id}
                convo={convo}
                index={index}
                conversations={conversations}
                setConversations={setConversations}
                setMessages={setMessages}
                setSelectedConvo={setSelectedConvo}
                setHide={setHide}
              />
              ))
           : (
            <p className={styles.emptyInbox}>Your inbox is empty.</p>
             )
           }
          </div>
        }
      </table>
    </form>
  );
}
