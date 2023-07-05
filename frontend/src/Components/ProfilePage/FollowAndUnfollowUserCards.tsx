import { Link } from "react-router-dom";
import { useAppDispatch } from "../../Configs/Redux/store";
import { followUser } from "../../Configs/Redux/account";
import { useState } from "react";
import { User } from "../../Configs/Types/Types";
import { styles } from "./FollowAndUnfollowStyles";

interface FollowingState {
  [key: string]: boolean;
}

export default function UserCard({ user }: { user: User }) {
  const [toggleFollow, setToggleFollow] = useState<FollowingState>({});
  const dispatch = useAppDispatch();

  function followSwitch(userId: string) {
    dispatch(followUser(userId));
    setToggleFollow((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  }

  return (
    <div className={styles.mainContainer}>
      <img
        className={styles.image}
        src={user.profilePictureUrl || "./default.png"}
        alt={`${user.firstName} ${user.lastName}`}
      />
      <div className={styles.username}>
        <Link to={`/user/${user.id}`}>
          <p
            className={styles.firstAndLastName}
          >{`${user.firstName} ${user.lastName}`}</p>
        </Link>
        <p className={styles.userName}>@{user.userName}</p>
      </div>
      {user.isFollowed ? (
        <span className={styles.hover} onClick={() => followSwitch(user.id)}>
          {toggleFollow[user.id] ? (
            <p className={styles.follow}>Follow</p>
          ) : (
            <p className={styles.unfollow}>Unfollow</p>
          )}
        </span>
      ) : (
        <span className={styles.hover} onClick={() => followSwitch(user.id)}>
          {toggleFollow[user.id] ? (
            <p className={styles.unfollow}>Unfollow</p>
          ) : (
            <p className={styles.follow}>Follow</p>
          )}
        </span>
      )}
    </div>
  );
}
