import { ClickAwayListener, IconButton, Slide } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import { reduceUnread, signOut } from "../../Configs/Redux/account";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileMenu from "./MobileMenu";

const styles = {
  mainContainer: `border-b-[1px] border-yellow-700/50 space-x-2 
  w-full flex justify-between items-center px-2 py-[0.1rem]`,
  img: `w-[30px] h-[30px] rounded-full border-[2px] border-yellow-700`,
  menuContainer: `z-10 absolute right-0 bg-black text-white p-2 
  border-[1px] border-yellow-700/50`,
  logout: ` cursor-pointer hover:bg-gray-800`,
};

export default function HorizontalNav() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, unreadPosts } = useAppSelector((state) => state.account);
  const [open, setOpen] = useState<boolean>(false)
  const isMobile = useMediaQuery('(max-width:480px)');
  const [menu,setMenu] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>

      {isMobile ?
 
        menu
        ?
        <div className="w-full px-1 pt-2 h-[60px] flex flex-row justify-between items-center">
         <MobileMenu
           menu={menu}
           setMenu={setMenu}
         />
        </div>
        :
        <div className="w-full px-1 pt-2 h-[60px] flex flex-row justify-between items-center">
        <SearchComponent/>
        <Link to="/">
         <img src="../logo.png" className="w-[60px] h-[25px]"/>
        </Link>
        {user
        ?
        <MenuIcon
        sx={{fill:"#a06207", fontSize: 30}}
        onClick={()=>setMenu(prev=>!prev)}
        className="cursor-pointer translate-y-[-3px]"
        />
        :
        <div className="w-[30px]"/>
          }


        </div>
        
        :
        <div className={styles.mainContainer}>
          <SearchComponent/>
          <img src="../logo.png" className="w-[100px]"/>
        <div>
          <IconButton onClick={handleClick}>

              <img
                src={user?.profilePictureUrl}
                alt="profilePic"
                className={styles.img}
              />

          </IconButton>
        </div>
       </div>
      }
       

      {open && (
        <ClickAwayListener onClickAway={handleClose}>
            <Slide direction="left" in={open} timeout={400} unmountOnExit>
              <div className={styles.menuContainer}>
                <p
                  className={styles.logout}
                  onClick={() => {
                    dispatch(signOut());
                    dispatch(reduceUnread(unreadPosts));
                    navigate("/login", { replace: true });
                    handleClose();
                  }}
                >
                  Logout
                </p>
              </div>
            </Slide>
        </ClickAwayListener>
      )}
    </div>
  );
}
