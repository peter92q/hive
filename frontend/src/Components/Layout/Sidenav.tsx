import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import { fetchUnreadPosts } from "../../Configs/Redux/account";

const styles = {
  mainContainer: `pt-3 px-2 pb-2 flex flex-row sm:flex-col text-[15px] 
  translate-x-[-8px] translate-y-[20px] sm:translate-x-0 sm:translate-y-0 hidden sm:block`,
  button: `w-[60px] h-[50px] px-2 border-[1px] bg-black
  border-yellow-700/50 flex justify-center items-center hover:bg-gray-900`
} 

export default function Sidenav() {
  const {user} = useAppSelector(state=>state.account);
  const dispatch = useAppDispatch();
  const {unreadPosts} = useAppSelector(state=>state.account)

  useEffect(()=>{
    dispatch(fetchUnreadPosts())
  },[user])

  return (
    <div className={styles.mainContainer}>
    <Link
      to="/"
      className={styles.button}
    >
      <HomeIcon sx={{ fill: "#c7d0d6" }} />
    </Link>
    <Link
      to="/messages"
      className={styles.button}
    >
      <Badge badgeContent={unreadPosts && unreadPosts} color="error">
      <MailOutlineIcon sx={{fill: "#c7d0d6"}}/>
      </Badge>
    </Link> 
    <Link
      to="/editProfile"
      className={styles.button}
    >
      <SettingsIcon sx={{ fill: "#c7d0d6" }} />
    </Link>
  </div>
  )
}
