import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useAppSelector } from "../../Configs/Redux/store";

export default function Socials() {
  const { user } = useAppSelector((state) => state.account);

  return (
    <div
      className="absolute left-0 ml-[10px] mt-[-120px] 
    lg:mt-[40px] text-white flex flex-row space-x-3"
    >
      <a
        href={`https://www.facebook.com/${user?.facebookUsername}`}
        target="_blank"
      >
        <FacebookIcon sx={{ fill: "#ca8a04" }} />
      </a>

      <a
        href={`https://www.instagram.com/${user?.instagramUsername}`}
        target="_blank"
      >
        <InstagramIcon sx={{ fill: "#ca8a04" }} />
      </a>

      <a
        href={`https://www.twitter.com/${user?.instagramUsername}`}
        target="_blank"
      >
        <TwitterIcon sx={{ fill: "#ca8a04" }} />
      </a>
    </div>
  );
}
