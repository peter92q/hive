import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import { useEffect } from "react";
import axios from "axios";
import { setSuggestedUsers } from "../../Configs/Redux/suggestedUsers";
import UserCard from "./UserCard";

const container = `rounded-md  text-black mt-3 p-[1px] 
flex flex-col border-[1.5px] border-yellow-700/50 sticky top-[280px]` 

export default function SuggestedUsers() {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector(state=>state.suggestedUsers);
 
    useEffect(() => {
        async function fetchUsers() { 
          const response = await axios.get('/Account/users', {
            params: { limit: 5 },
          });
          dispatch(setSuggestedUsers(response.data));
        }  
          fetchUsers();
      }, []);

  return (
    <div className={container}>
        {users.map((user, index)=>(
            <UserCard key={index} suggestedUser={user} index={index}/>
        ))}
    </div>  
  )
}
