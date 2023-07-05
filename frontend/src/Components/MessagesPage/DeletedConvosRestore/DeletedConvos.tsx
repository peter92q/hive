import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { ConvoProps, InboxMessageProps } from "../../../Configs/Types/Types";
import ConvoCard from "../Inbox/ConvoCard";
import MessageCard from "../Inbox/MessageCard";
import TableHeader from "../../../Configs/staticData";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const styles = {
  formContainer: `w-full h-full flex flex-col overflow-y-scroll mt-2 px-2`,
  mainContainer: `md:h-full w-full md:w-[30%] border-r-[1px] border-yellow-700/50`,
  deletedConvos: `text-white font-medium py-1 px-1 border-b-[1px] border-yellow-700/50`,
  emptyBin: `text-white text-center mt-2 text-[20px]`,
  messageCard: `h-full md:w-[70%]  flex flex-col justify-end items-end`,
};

export default function DeletedConvos(
  {
    setHide
  }
  :
  {
    setHide:React.Dispatch<SetStateAction<boolean>>;
  }
) {
  const [conversations, setConversations] = useState<ConvoProps[]>([]);
  const [messages, setMessages] = useState<InboxMessageProps[]>([]);
  const [_selectedConvo, setSelectedConvo] = useState<number | null>(null);
  const [_recipient, setRecipient] = useState<string | null>(null);


  useEffect(() => {
    async function getConvos() {
      const convos = await axios.get(
        "http://localhost:5001/api/Message/allDeletedConvos"
      );
      setConversations(convos.data);
    }
    getConvos();
  }, []);

  return ( 
    <div className={styles.formContainer}>
      {messages[0] && 
            <div
            onClick={()=>{setMessages([]); setHide(false)}} 
            className="text-white flex justify-start items-start w-full px-2">
              <ArrowBackIosIcon sx={{fill:"white", fontSize:28, cursor: 'pointer', marginBottom:"10px"}}/>
              <p className="cursor-pointer">Back</p>
          </div>
      }
        <TableHeader/>
          {conversations.length > 0 ? (
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
          ) : (
            <p className={styles.emptyBin}>Your bin is empty.</p>
          )}
      
      <div className={styles.messageCard}>
        {messages.map((message, index) => (
          <MessageCard
            key={message.messageId}
            index={index}
            message={message}
            setRecipient={setRecipient}
          />
        ))}
      </div>
    </div>
  );
}
