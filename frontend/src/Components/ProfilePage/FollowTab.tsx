import axios from 'axios';
import { SetStateAction, useEffect, useState } from 'react';
import { User } from '../../Configs/Types/Types';
import FollowAndUnfollowUserCards from './FollowAndUnfollowUserCards';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';

interface showFollowProps{
    opened: boolean;
    type: string;
}

interface Props {
    showFollow: showFollowProps;
    setShowFollow: React.Dispatch<SetStateAction<showFollowProps>>;
    currentProfile: User;
}

export default function FollowTab({showFollow, currentProfile, setShowFollow}: Props) {
    const [followData, setFollowData] = useState<User[]>([]);

    const handleOutsideClick = () => {
        setShowFollow(prev => ({
          ...prev,
          opened: false,
          type: ""
        }));
      };

    useEffect(() => {
      async function fetchFollow() {
        const result = await axios.get<User[]>(
          `http://localhost:5001/api/account/${currentProfile?.id}/${showFollow.type}`
        );
        setFollowData(result.data)
      }
      fetchFollow();
    }, [showFollow.opened]);
 
  return (
    <>
      {
        showFollow.opened &&
        <ClickAwayListener onClickAway={handleOutsideClick}>
          <Slide direction="up" in={showFollow.opened} timeout={500} unmountOnExit>
           <div className='flex flex-col w-[90vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw]  
                           border-[1.5px] border-yellow-700/50 rounded-sm absolute 
                           z-30 max-h-[50vh] overflow-y-scroll bg-black'
             >
              <div className='w-full h-[30px] border-b-[1px] border-yellow-700/50 flex 
                              items-center justify-end pr-1'
                >
                <CloseIcon 
                  onClick={handleOutsideClick}
                  sx={{fill:"white", fontSize:20}}
                  className='hover:bg-gray-500/40 cursor-pointer rounded-full'
                />
             
              </div>
              {followData.map((followUser, index)=>(
                    <FollowAndUnfollowUserCards key={index} user={followUser}/>
                ))}  
           </div>
          </Slide>
        </ClickAwayListener>
      }
    </>
  )
}
