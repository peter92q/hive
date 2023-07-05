import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import axios from "axios";
import { ConvoProps } from "../../../Configs/Types/Types";
import { SetStateAction } from "react";

const styles = { 
  mainContainer: 'translate-y-[-2px] cursor-pointer',
}

export default function DeleteRestore({
  isUserDeleted,
  conversations,
  index,
  setConversations,
  id,
}: {
  isUserDeleted: boolean;
  conversations: ConvoProps[];
  setConversations: React.Dispatch<SetStateAction<ConvoProps[]>>;
  index: number;
  id: string;
}) {
  async function deleteConvo() {
    const response = await axios.post(
      `http://localhost:5001/api/Message/deleteChat/${id}`
    );
    console.log(response.data);
    const updatedConversations = conversations.filter((_, i) => i !== index);
    setConversations(updatedConversations);
  }

  async function restoreConvo() {
    const response = await axios.post(
      `http://localhost:5001/api/Message/restoreChat/${id}`
    );
    console.log(response.data);
    const updatedConversations = conversations.filter((_, i) => i !== index);
    setConversations(updatedConversations);
  }

  return (
    <>
      {isUserDeleted ? (
        <div
          onClick={restoreConvo}
          className={styles.mainContainer}
        >
          <RestoreFromTrashIcon 
          sx={{ fill: "green",fontSize: 22,marginTop:"7px"  }} 
          
          />
        </div>
      ) : (
        <div
          onClick={deleteConvo}
          className={styles.mainContainer}
        >
          <DeleteForeverIcon sx={{ fill: "red",fontSize:22,marginTop:"7px"  }} />
        </div>
      )}
    </>
  );
}
