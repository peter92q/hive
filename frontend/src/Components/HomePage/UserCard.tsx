import {  useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { User } from '../../Configs/Types/Types';
import { useAppDispatch, useAppSelector } from '../../Configs/Redux/store';
import { followUser } from '../../Configs/Redux/account';
import { styles } from './UserCardStyles';

interface UserCardProps {
  suggestedUser: User;
  index: number;
}

export default function UserCard({ suggestedUser, index }: UserCardProps) {
  const [user, setUser] = useState(suggestedUser);
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.account);
  const usr = suggestedUser;
  const handleFollowButtonClick = async () => {
     await dispatch(followUser(suggestedUser.id));
     setUser((prevState) => ({ ...prevState, isFollowed: !prevState.isFollowed }));
  };
  
  return (
    <div className={`py-1 px-2 min-w-[18vw] ${index === 4 ? "" : "border-b-[1px] border-yellow-700/50"}`}>
      <div className={styles.subContainer}>
        <div className={styles.imageAndNameWrapper}>
        <Link to={`user/${usr.id}`}>
          <img
            src={`${usr.profilePictureUrl ? usr.profilePictureUrl :'./default.png' }`}
            className={styles.image}
            alt="suggestedUserPic"
          />
        </Link> 
        <Link to={`user/${usr.id}`}>
          <div className='flex flex-col'>
          <p className={styles.firstAndLastName}>{usr.firstName} { usr.lastName}</p>
          <p className={styles.userName}>@{usr.username}</p> 
          </div>
         </Link>
        </div>

        <div className={styles.followUnfollowWrapper}>
        <button
            onClick={handleFollowButtonClick}
            className={styles.button}
          > 
            {user.isFollowed ? (
              status.includes(`pendingFollow_${usr.id}`) ? (
                <ClipLoader size={15} color="white"/>
              ) : (
                'Unfollow'
              )
            ) : status.includes(`pendingFollow_${usr.id}`) ? (
              <ClipLoader size={15} color="white"/>
            ) : (
              'Follow'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
