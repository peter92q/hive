import { ClipLoader } from "react-spinners";
import { followUser } from "../../Configs/Redux/account";
import { updateSuggestedUser } from "../../Configs/Redux/suggestedUsers";
import { useAppDispatch } from "../../Configs/Redux/store";
import { SetStateAction, useState } from "react";
import { User } from "../../Configs/Types/Types";

const button = `bg-yellow-700 text-black
absolute text-[14px] right-[100px] mr-[10px] mt-[-110px] 
lg:mt-[45px] py-[4.5px] rounded-sm hover:opacity-80 
cursor-pointer min-w-[90px] max-w-[90px]`

export default function FollowButton(
    {setProfileUser, currentProfile}
    :
    {  
        setProfileUser: React.Dispatch<SetStateAction<User | null>>,
        currentProfile: User | null;
    }
    ) 
    {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const handleFollowButtonClick = async () => {
        setLoading(true);
        const success = await dispatch(followUser(currentProfile!.id));
        if (success) {
          if (currentProfile) {
            const updatedTargetUser = {
              ...currentProfile,
              isFollowed: !currentProfile.isFollowed,
              followersCount: currentProfile.isFollowed
                ? currentProfile.followersCount - 1
                : currentProfile.followersCount + 1,
            };
            setProfileUser(updatedTargetUser);
            dispatch(updateSuggestedUser(updatedTargetUser));
          }
        }
        setLoading(false);
      };

  return (
    <button
    className={button}
    onClick={handleFollowButtonClick}
  >
    {currentProfile?.isFollowed ? (
      loading === true ? (
        <ClipLoader color="#ffffff" size={15} />
      ) : (
        "Unfollow"
      )
    ) : loading === true ? (
      <ClipLoader color="#ffffff" size={15} />
    ) : (
      "Follow"
    )}
  </button>
  )
}
