import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../Configs/Redux/store";
import { Alert, Snackbar } from "@mui/material";
import { setUser } from "../Configs/Redux/account";
import Hashtags from "../Components/EditProfilePage/Hashtags";

const styles = {
  label: `text-black border-[1px] border-yellow-700/50 text-gray-200 px-2 rounded-tr-md 
  text-[15px] font-medium translate-y-[1px]`,
  input: `outline-0 w-[93vw] sm:w-[50vw] md:w-[40vw] lg:w-[15vw] bg-slate-700 
  px-2 py-[1px] rounded-tr-md border-[1px] border-yellow-700/50 text-gray-300
   focus:border-yellow-600 mb-3`,
  formContainer: `text-red-500 text-[20px] flex flex-col w-full items-center justify-center 
  overflow-y-scroll mt-2 h-screen`,
  selectHashtagContainer: `flex md:flex-row flex-col w-full overflow-y-auto md:w-[60%]`,
  inputsWrapper: `ml-4 flex justify-start items-start flex-col w-[40%] translate-y-[7px]`,
  button: `bg-gradient-to-r from-yellow-700 via-yellow-700 to-yellow-800
  text-black px-[10px] mt-4 rounded-sm mx-auto hover:opacity-80 mb-[80px] sm:mb-0`,
};

function ProfileUpdateForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const { register, handleSubmit, setValue } = useForm();
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [snack, setSnack] = useState<boolean>(false);

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await axios.put(
        "http://localhost:5001/api/Account/updateProfile",
        {
          ...data,
          hashtags: hashtags.slice(0, 5),
        }
      );
      dispatch(setUser(response.data));
      setSnack(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue("firstName", user?.firstName || "");
    setValue("lastName", user?.lastName || "");
    setValue("country", user?.country || "");
    setValue("description", user?.description || "");
    setValue("facebookUsername", user?.facebookUsername || "");
    setValue("instagramUsername", user?.instagramUsername || "");
    setValue("twitterUsername", user?.twitterUsername || "");
    if(user && user?.hashtags.length>0)
    {
      setHashtags(user.hashtags)
    }
    console.log(hashtags.length)
  }, [user, setValue]);
 
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      
      <div className={styles.selectHashtagContainer}>
        <Hashtags hashtags={hashtags} setHashtags={setHashtags}/> 
        <div className={styles.inputsWrapper}> 
          <p className={styles.label}>First Name</p>
          <input
            className={styles.input}
            type="text"
            {...register("firstName", { required: true })}
          />
          <p className={styles.label}>Last Name</p>
          <input
            type="text"
            className={styles.input}
            {...register("lastName", { required: true })}
          />
          <p className={styles.label}>Country</p>
          <input
            type="text"
            className={styles.input}
            {...register("country", { required: true })}
          />

          <p className={styles.label}>Description</p>
          <input className={styles.input} {...register("description")} />

          <p className={styles.label}>Facebook Username</p>
          <input
            type="text"
            className={styles.input}
            {...register("facebookUsername")}
          />

          <p className={styles.label}>Instagram Username</p>
          <input
            type="text"
            className={styles.input}
            {...register("instagramUsername")}
          />

          <p className={styles.label}>Twitter Username</p>
          <input
            type="text"
            className={styles.input}
            {...register("twitterUsername")}
          />
                  <button type="submit" className={styles.button}>
          Update Profile
        </button>
      
        </div>

      </div>

      <Snackbar
        open={snack}
        autoHideDuration={2000}
        onClose={() => setSnack(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Profile update successfully!
        </Alert>
      </Snackbar>
    </form>
  );
}

export default ProfileUpdateForm;
