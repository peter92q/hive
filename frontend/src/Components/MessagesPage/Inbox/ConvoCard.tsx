import React, { SetStateAction } from "react";
import { ConvoProps, InboxMessageProps } from "../../../Configs/Types/Types";
import { reduceUnread } from "../../../Configs/Redux/account";
import { useAppDispatch, useAppSelector } from "../../../Configs/Redux/store";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import DeleteRestore from "./DeleteRestore";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ConvoCard({
  convo,
  index,
  conversations,
  setConversations,
  setMessages,
  setSelectedConvo,
  setHide
}: {
  convo: ConvoProps;
  index: number;
  conversations: ConvoProps[];
  setConversations: React.Dispatch<SetStateAction<ConvoProps[]>>;
  setMessages: React.Dispatch<SetStateAction<InboxMessageProps[]>>;
  setSelectedConvo: React.Dispatch<SetStateAction<number | null>>;
  setHide: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:480px)');

  async function resetUnread() {
    const response = await axios.post(
      "http://localhost:5001/api/Message/resetUnread",
      {
        chatId: convo.id,
      }
    );
    console.log(response.data);
    const updatedConversations = [...conversations];
    updatedConversations[index] = {
      ...(updatedConversations[index] as any),
      unreadMessageCount: 0,
    };
    setConversations(updatedConversations);
  }

  async function loadConvo() {
    const response = await axios.post(
      "http://localhost:5001/api/Message/allConvoMessages",
      {
        chatId: convo.id,
      }
    );
    setMessages(response.data);
  }

  const isUserDeleted = convo.deletedForIds.some(
    (deleteProp) => deleteProp.userId === user!.id
  );

  return ( 
    
  <div className="w-full flex flex-row text-start mt-[2px] border-b-[1px] border-yellow-700/30">
    <tr 
        onClick={() => {
          if (convo.lastMessageById !== user?.id) {
            resetUnread();
            dispatch(reduceUnread(convo.unreadMessageCount));
          }
          if(isMobile){
            setHide(prev=>!prev)
          }
          loadConvo();
          setSelectedConvo(index);
        }}
        className="w-full mx-auto text-white flex flex-row justify-between 
                 items-start py-[4px] cursor-pointer hover:bg-gray-900 " 
                > 
             
      {/************TD1***************/} 
      <td className="w-[10%] pl-[3px]">
        {(user?.id === convo.idUserA && (
                <img
                  className="w-6 h-6 rounded-full border-[1px] border-yellow-700 p-[2px]"
                  src={convo.picUserB}
                  alt="Profile"
                /> 
              )) ||
                (user?.id === convo.idUserB && (
                  <img
                    className="w-6 h-6 rounded-full border-[1px] border-yellow-700 p-[2px]"
                    src={convo.picUserA}
                    alt="Profile"
                  />
          ))}
      </td> 
      {/************TD1***************/}

      {/************TD2***************/}
      <td className="md:w-[20%] w-[22%]">
        <p className="font-semibold text-[10px] pt-[3px] md:pt-[2.5px] md:text-[12px] 2xl:text-[20px]">
                {(user?.id === convo.idUserA && convo.usernameUserB) ||
                  (user?.id === convo.idUserB && convo.usernameUserA)}
        </p>
      </td>
      {/************TD2***************/}

      {/************TD3***************/}
      <td className="md:w-[50%] w-[40%]">
        <div className="flex flex-row text-[10px] pt-[3px] md:pt-[2.5px] md:text-[12px] 2xl:text-[20px]">
              <p className="mr-1 md:mr-4">
                {convo.lastMessageById === user?.id
                  ? "You"
                  : (user?.id !== convo.idUserA && convo.usernameUserA) ||
                    (user?.id !== convo.idUserB && convo.usernameUserB)}
                :
              </p>
              <p className="font-bold w-full text-yellow-600 2xl:text-[18px]">
                {convo.lastMessageShort.slice(0, 15)}
              </p>
            </div>
      </td>
      {/************TD3***************/}

      {/************TD4***************/}
      <td className="w-[10%] translate-x-[30px]">
      {convo.lastMessageById === user?.id ? (
              "" 
            ) : (
              <>
                {convo.unreadMessageCount && convo.unreadMessageCount > 0 ? (
                  <div className="flex flex-row">
                    <EmailIcon sx={{ fill: "#ca8a04", fontSize: 22 }} />
                    <p
                      className="ml-[5px] text-white text-[15px]"
                    >
                      {convo.unreadMessageCount}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
      </td>
      {/************TD4***************/}

      {/************TD5***************/}
      <td className="md:w-[3%] w-[9%] px-1">
      </td>
         {/************TD5***************/}

    </tr>
    <div className="md:w-[10%] w-[15%] px-1"> 
        <DeleteRestore
          isUserDeleted={isUserDeleted}
          conversations={conversations}
          setConversations={setConversations}
          index={index}
          id={convo.id}
        
        />
      </div>
  </div>
  );
}
