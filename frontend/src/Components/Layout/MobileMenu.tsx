import { Slide } from "@mui/material";
import { SetStateAction } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from '@mui/icons-material/Logout';
import { reduceUnread, signOut } from "../../Configs/Redux/account";

const styles = {
  mainContainer: `absolute left-0 top-0 h-full w-full  bg-[rgba(0,0,0,0.8)] z-20`,
  subContainer: `w-[60%] absolute right-0 h-[98vh] bg-black border-[1px] border-yellow-700/50 translate-y-[25px] z-50 flex flex-col
  justify-baseline cursor-pointer`,
  button: `w-full h-[50px] px-2 border-b-[1px] bg-black hover:bg-gray-900
    border-yellow-700/50 flex justify-center items-center hover:bg-gray-900`,
  pText: `text-white mr-1 font-medium text-[20px]`,
};

export default function MobileMenu({
  menu,
  setMenu,
}: { 
  menu: boolean;
  setMenu: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { unreadPosts } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  return (
    <Slide direction="left" in={menu} timeout={500} unmountOnExit>
      <div
        onClick={() => setMenu(false)} 
        className={styles.mainContainer}>
        <div
          className={styles.subContainer}
        >
          <div onClick={() => setMenu(false)} className={styles.button}>
            <p className={styles.pText}>Close</p>
            <CloseIcon sx={{ fill: "white", marginTop: "3px" }} />
          </div>
          <Link
            onClick={() => setMenu(false)}
            to="/messages"
            className={styles.button}
          >
            <p className={styles.pText}>Messages</p>
            <Badge badgeContent={unreadPosts && unreadPosts} color="error">
              <MailOutlineIcon sx={{ fill: "#c7d0d6" }} />
            </Badge>
          </Link>
          <Link
            onClick={() => setMenu(false)}
            to="/editProfile"
            className={styles.button}
          >
            <p className={styles.pText}>Settings</p>
            <SettingsIcon sx={{ fill: "#c7d0d6" }} />
          </Link>
          <Link
            onClick={() =>{
              setMenu(false);
              dispatch(signOut());
              dispatch(reduceUnread(unreadPosts));
              navigate("/login", { replace: true });
             }}
            to="/editProfile"
            className={styles.button}
          >
            <p className={styles.pText}>Logout</p>
            <LogoutIcon sx={{ fill: "#c7d0d6" }} />
          </Link>
        </div>
      </div>
    </Slide>
  );
}
