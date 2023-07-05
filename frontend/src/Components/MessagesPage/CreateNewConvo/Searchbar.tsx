import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Checkbox from "@mui/material/Checkbox";
import { useDebounce } from "../../../Configs/Functions/useDebounce";
import { CheckProps, UserCardProps } from "../../../Configs/Types/Types";
import { styles } from "./SearchbarStyles";

export default function SearchUsers({
  setRecipient,
}: {
  setRecipient: React.Dispatch<SetStateAction<string>>;
}) {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<UserCardProps[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(name, 500);

  const [checkBoxData, setCheckBoxData] = useState<CheckProps>({
    index: null,
    id: null,
  });

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

  function handleChange(index: number, id: string) {
    setCheckBoxData({ index: index, id: id });
    setRecipient(id);
  }

  return (
    <div className="w-full text-white">
      <div className={styles.subContainer}>
        <input
          type="text"
          placeholder="Search user..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <div className="mr-2 mt-1.5">
          {loading ? (
            <CircularProgress
              size={32}
              sx={{ fill: "white" }}
              className="bg-yellow-600 p-1 rounded-full"
            />
          ) : (
            <SearchIcon
              sx={{ fontSize: 32, fill: "black" }}
              className="bg-yellow-600 p-1 rounded-full"
            />
          )}
        </div>
      </div>
      <div className={styles.foundUsersContainer}>
        {users &&
          users.map((user, index) => (
            <div key={user.id} className={styles.individualUserCard}>
              <div className={styles.mainCardContainer}>
                <div className="w-[35%]">
                  <img
                    className={styles.img}
                    src={user.profilePictureUrl || "./logo.png"}
                    alt="Profile"
                  />
                </div>
                <div className="flex flex-col text-start w-[60%]">
                  <Link to={`user/${user.id}`} onClick={() => setName("")}>
                    <p className={styles.username}>
                      {user.name}
                    </p>
                  </Link>
                  <p className="text-gray-300">{user.userName}</p>
                </div>

                <div className="w-[15%]">
                  <Checkbox
                    checked={
                      checkBoxData.id === user.id &&
                      checkBoxData.index === index
                    }
                    onClick={() => handleChange(index, user.id)}
                    sx={{
                      color: "green",
                      "& .MuiSvgIcon-root": { fontSize: 33 },
                      "&.Mui-checked": {
                        color: "green",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
