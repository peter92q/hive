import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogPostDto, User } from "../Configs/Types/Types";
import { useAppSelector } from "../Configs/Redux/store";
import ProfileDetails from "../Components/ProfilePage/ProfileDetails";
import DeletePost from "../Components/ProfilePage/DeletePost";
import IndividualPostWindow from "../Components/ProfilePage/IndividualPostWindow";

export default function ProfilePage() {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [postsList, setPostsList] = useState<BlogPostDto[] | null>(null);
  const [postIndex, setPostIndex] = useState<number | null>(null);
  const { user } = useAppSelector((state) => state.account);
  const { id } = useParams<{ id: string }>();
  const currentProfile = user?.id === id ? user : profileUser;

  async function fetchPosts() {
    try {
      const response = await axios.get<BlogPostDto[]>(
        `/blogposts/${currentProfile?.id}`
      );
      setPostsList(response.data);
      console.log(response.data);
    } catch (error: any) {
      console.log(error);
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get<User>(`/account/users/${id}`);
      setProfileUser(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (currentProfile?.id === user?.id) {
      fetchPosts();
    } else if (currentProfile?.id !== user?.id) {
      fetchUser();
      setTimeout(() => {
        fetchPosts();
      }, 200);
    }
  }, [user, currentProfile?.id]);

  return (
    <div>
      <ProfileDetails
        currentProfile={currentProfile as User}
        setProfileUser={setProfileUser}
      />
      <div className="flex flex-row flex-wrap px-1 translate-y-[-60px] sm:translate-y-[-50px]">
        {postsList &&
          postsList.map((post, index) => (
            <div className="flex flex-grow flex-col max-w-[33%] mx-auto">
              {post.authorId === user?.id && (
                <DeletePost
                  postsList={postsList}
                  setPostsList={setPostsList}
                  postId={post.id}
                />
              )}
              <img
                key={index}
                onClick={() => setPostIndex(index)}
                src={post.image}
                alt="blogpostImage"
                className={`border-[1px] h-full border-yellow-700/50 ${
                  postIndex !== null && "hidden"
                }`}
              />
            </div>
          ))}
      </div>
      {postIndex !== null && (
        <IndividualPostWindow
          postsList={postsList}
          setPostsList={setPostsList}
          postIndex={postIndex}
          setPostIndex={setPostIndex}
        />
      )}
    </div>
  );
}
