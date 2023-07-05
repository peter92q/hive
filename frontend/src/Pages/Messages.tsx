import MailIcon from "@mui/icons-material/Mail";
import NewMessage from "../Components/MessagesPage/CreateNewConvo/NewMessage";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import Inbox from "../Components/MessagesPage/Inbox/Inbox";
import DeletedConvos from "../Components/MessagesPage/DeletedConvosRestore/DeletedConvos";

const styles = {
  mainContainer: `w-full flex md:flex-row flex-col md:h-full`,
  subContainer: `flex flex-col pl-2 pt-2 gap-1 w-[100%] md:w-[20%] h-full border-r-[1px]
  border-yellow-700/30 pr-2 pb-2`,
  mailboxButtons: `flex flex-row text-white cursor-pointer rounded-xl px-2 py-[1px]`,
};

export default function Messages() {
  const [menuItem, setMenuItem] = useState<number>(1);
  const [hide, setHide] = useState(false);
  return (
    <div className={styles.mainContainer}>
     {!hide?
      <div className={styles.subContainer}
          >
          <div 
            onClick={()=>setMenuItem(1)}
            style={{transition:'background 0.3s ease-in-out'}}
            className={`${styles.mailboxButtons} ${menuItem ===1 && "bg-gray-800"}`}>
              <MailIcon
                sx={{ fill: "#ca8a04" }}
              />
              Inbox
          </div>
        <div
          style={{transition:'background 0.3s ease-in-out'}}
        onClick={()=>setMenuItem(2)} 
          className={`${styles.mailboxButtons} ${menuItem===2 && "bg-gray-800"}`}>
              <CreateIcon
                sx={{ fill: "#ca8a04" }}
              />
              New message
        </div>
        <div 
                       onClick={() => setMenuItem(3)}
          style={{transition:'background 0.3s ease-in-out'}}
          className={`${styles.mailboxButtons} ${menuItem===3 && "bg-gray-800"}`}>
              <DeleteIcon
 
                sx={{ fill: "#ca8a04" }}
              />
              Deleted
          </div>
      </div>
      :
      <></> 
      } 
      <div className="w-[100%] md:w-[80%]">
      {menuItem === 1 && <Inbox setHide={setHide}/> }
      {menuItem === 2 && <NewMessage/> }
      {menuItem === 3 && <DeletedConvos setHide={setHide}/> }    
      </div> 
    </div>
  );
}
