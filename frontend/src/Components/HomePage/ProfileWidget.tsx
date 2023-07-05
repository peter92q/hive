import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { reduceUnread, signOut } from "../../Configs/Redux/account";
import { styles } from "./ProfileWidgetStyles";

export default function ProfileWidget() {
  const { user, unreadPosts } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <> 
      {user ? (
        <div className={styles.mainContainer}>
          <div className={styles.subContainer}>
            <img src={user?.profilePictureUrl} className={styles.image} />
            <div className={styles.followContainer}>
              <div className="table text-center">
                <p>Followers</p>
                <p className="text-yellow-700">{user?.followersCount}</p>
              </div>

              <div className="table text-center">
                <p>Following</p>
                <p className="text-yellow-700">{user?.followingCount}</p>
              </div>
            </div>

            <div className={styles.usernameCutoff}>
              <div className={styles.firstlastname}>
                {user?.firstName} {user?.lastName}
              </div>

              <div className={styles.username}>
                <p className="text-[14px]">@{user?.username}</p>
              </div>

              <div className={styles.buttonsWrapper}>
                <p
                  onClick={() => navigate(`/user/${user?.id}`)}
                  className={`${styles.profileButton}`}
                >
                  <Person2Icon
                    sx={{ fontSize: 20 }}
                    className="translate-y-[-2px]"
                  />
                  Profile
                </p>
                <p
                  onClick={() => {
                    dispatch(signOut());
                    dispatch(reduceUnread(unreadPosts));
                    navigate("/login", { replace: true });
                  }}
                  className={styles.logoutButton}
                >
                  Logout{" "}
                  <LogoutIcon
                    sx={{ fontSize: 20 }}
                    className="translate-y-[-2px]"
                  />
                </p>
              </div>
            </div>

            <div className={styles.joinedBox}>
              <p>Joined: &nbsp;</p>
              <p className="text-yellow-700">{user?.memberSince}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.shimmy1}>
          <div className={styles.shimmy2}>
            <div className="shimmer"></div>
          </div>
        </div>
      )}
    </>
  );
}
