import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChangeProfilePic from "./ChangeProfilePic";
import { User } from "../../Configs/Types/Types";
import { SetStateAction, useState } from "react";
import FollowTab from "./FollowTab";
import EmailIcon from "@mui/icons-material/Email";
import MessageWindow from "./MessageWindow";
import Socials from "./Socials";
import { useAppSelector } from "../../Configs/Redux/store";
import FollowButton from "./FollowButton";
import { styles } from "./ProfileDetailsStyles";

export default function ProfileDetails({
  currentProfile,
  setProfileUser,
}: {
  currentProfile: User;
  setProfileUser: React.Dispatch<SetStateAction<User | null>>;
}) {
  const { user } = useAppSelector((state) => state.account);
  const [showFollow, setShowFollow] = useState({
    opened: false,
    type: "",
  });
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <div
          className={styles.followersFollowing}
        >
           <Socials />
          <div
            onClick={() => {
              setShowFollow(() => ({
                opened: true,
                type: "followers",
              }));
            }}
            className={styles.followers}
          >
            <p>Followers</p>
            <p className="text-yellow-700">{currentProfile?.followersCount}</p>
          </div>
          <div
            onClick={() => {
              setShowFollow(() => ({
                opened: true,
                type: "following",
              })); 
            }}
            className={styles.following}
          >
            <p>Following</p>
            <p className="text-yellow-700">{currentProfile?.followingCount}</p>
          </div>
          {currentProfile?.id !== user?.id && (
          <FollowButton 
            setProfileUser={setProfileUser}
            currentProfile={currentProfile as User}
            />  
          )} 
           {currentProfile?.id !== user?.id && (
            <p onClick={() => setOpen(true)} 
              className={styles.messageButton}>
              Message
              <EmailIcon
                sx={{
                  fontSize: 18,
                  marginBottom: "1px",
                  marginLeft: "4px",
                  fill: "black",
                }}
              />
            </p>
          )} 
          <MessageWindow open={open} setOpen={setOpen} id={currentProfile?.id} />  
        </div>
      </div>
      {currentProfile?.id === user?.id && <ChangeProfilePic />}
      <img
        src={currentProfile?.profilePictureUrl}
        className={styles.image}
      />
      <FollowTab 
          showFollow={showFollow}
          setShowFollow={setShowFollow}
          currentProfile={currentProfile}
        />
      <div className={styles.secondContainer}>
        <div className={styles.tagsWrapper}>
           
        {currentProfile && currentProfile.hashtags.map((tag, index) => (
            <div key={index} className={styles.tag}
            >
              #{tag}
            </div> 
          ))}
        </div>
        <div className={styles.firstlastnamelocation}
          >
           <p className={styles.firstlastname}>
            {currentProfile?.firstName}&nbsp;{currentProfile?.lastName}
           </p> 
           <p className={styles.location}>
            {currentProfile?.country} 
            <LocationOnIcon sx={{marginBottom:"2px", fontSize:14}} />
            </p> 
        </div>
        <div className={styles.descriptionWrapper} 
           style={{ overflowWrap: 'break-word' }}
           >
        <p className="pl-5 text-right">
          {currentProfile?.description}
        </p>
        </div>
      </div>
    </div> 
  );
}
