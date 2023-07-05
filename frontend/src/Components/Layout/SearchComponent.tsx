import SearchIcon from "@mui/icons-material/Search";
import './searchcomponent.css'
import { useEffect, useState } from "react";
import { UserCardProps } from "../../Configs/Types/Types";
import { useDebounce } from "../../Configs/Functions/useDebounce";
import axios from "axios";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { ClipLoader } from "react-spinners";
import { Link } from "@mui/material";

const styles = 
  {
    mainContainer: `flex flex-row relative cursor-pointer`,
    loadingIcon: `bg-black p-1 z-20 translate-x-2 border-[1px] border-yellow-700 rounded-full w-[30px] h-[30px]`,
    searchIcon: `rounded-full translate-x-2 z-20 bg-black p-1 border-[1px] border-yellow-700`,
    input: `tt two absolute left-[30px] bg-gray-800 h-[27px] rounded-tr-md rounded-br-md text-white`,
    foundUsersContainer: `rounded overflow-auto max-h-48 absolute z-20 bg-black mt-[28px] 
    ml-[10px] w-[160px] cursor-pointer overflow-x-auto `,
    individualUserCard: `px-4 py-1 text-white hover:bg-gray-900
     border-yellow-700  w-full`,
    mainCardContainer: `flex flex-row`,
    img: `w-10 h-10 rounded-full border-[2px] border-yellow-700/50 p-[2px] translate-x-[-10px]`,
    firstlastname: `font-semibold text-[14px]`,
    usernameWrapper: `flex flex-col text-start`,
    username: `text-gray-300 text-[12px]`
  };

export default function SearchComponent() {
    const [name, setName] = useState("");
    const [users, setUsers] = useState<UserCardProps[] | null>(null);
    const [loading, setLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(name, 500);

    const handleClick = () => {
        const elementTwo = document.querySelector('.two') as HTMLInputElement | HTMLDivElement;
        if (elementTwo) {
          elementTwo.focus();
        }
      }; 
      
      useEffect(() => {
        if (debouncedSearchTerm) {
          setLoading(true);
          axios
            .get<UserCardProps[]>(
              `Account/users/search?name=${debouncedSearchTerm}`
            )
            .then((response) => {
              const responseData = response.data;
              if (responseData.length === 0) {
                setUsers(null);
              } else {
                setUsers(response.data);
              }
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          setUsers([]);
        }
      }, [debouncedSearchTerm]);

  return (
   <div className={styles.mainContainer}>
    {
        loading
        ?
        <div className={styles.loadingIcon}>
        <ClipLoader 
        color="#fff" size={20}
        />
        </div>

      :
      <SearchIcon 
      sx={{ fill:"white", fontSize: 29, marginTop:"-1px" }}
      className={styles.searchIcon}
      onClick={handleClick}
      />
    }
    <input 
        type="text" 
        name="search" 
        placeholder="Search user..." 
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
        />
        <ClickAwayListener onClickAway={()=>{setUsers(null);setName("")}}>
        <div className={`${styles.foundUsersContainer} ${users && users.length>0 && "border-[1px] border-yellow-700/50"}`}>
        {users &&
          users.map((user) => (
            <div 
            
            key={user.id} className={styles.individualUserCard}>
              <Link 
                style={{ color: 'inherit', textDecoration: 'none' }}
                href={`/user/${user.id}`}>
              <div className={styles.mainCardContainer}>
                <div>
                  <img
                    className={styles.img}
                    src={user.profilePictureUrl || "./logo.png"}
                    alt="Profile"
                  />
                </div>
                <div className={styles.usernameWrapper}>
                    <p 
                      className={styles.firstlastname}>
                      {user.name}
                    </p>
                  
                  <p className={styles.username}>{user.userName}</p>
                </div>
              </div>
              </Link>
            </div>
          ))}
      </div>
      </ClickAwayListener>
   </div> 
  )
}
