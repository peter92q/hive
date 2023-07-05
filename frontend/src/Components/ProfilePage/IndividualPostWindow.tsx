import CloseIcon from "@mui/icons-material/Close";
import SubmitComment from './SubmitComment'
import PostLike from './PostLike'
import CommentsWindow from './CommentsWindow'
import { BlogPostDto } from "../../Configs/Types/Types";
import { SetStateAction } from "react";
import { Slide, ClickAwayListener } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function IndividualPostWindow(
    {
        postsList,
        setPostsList,
        postIndex,
        setPostIndex
    }
    :
    {
        postsList: BlogPostDto[] | null;
        setPostsList: React.Dispatch<SetStateAction<BlogPostDto[] | null>>;
        postIndex: number | null;
        setPostIndex: React.Dispatch<SetStateAction<number | null>>;
    }
) {
  return (
    <ClickAwayListener onClickAway={() => setPostIndex(null)}>
    <Slide
    direction="down"
    in={postIndex !== null}
    timeout={400}
    unmountOnExit
  >
    <div
    className="w-full z-20 absolute bg-black 
   min-h-screen pb-40 top-0 flex flex-row"
  >
    <div className="flex flex-col md:flex-row w-full h-full justify-center sm:mt-[40px] ">
      <img
        src={postsList![postIndex!].image} 
        className="w-[100%] md:w-[50%] h-[65vh] sm:border-[1px] border-yellow-700/50"
      />
      <div className="bg-black w-[100%] md:w-[340px] overflow-y-auto 
      sm:border-[1px] border-yellow-700/50">
        <div
          className="w-full  border-yellow-700/50 py-1 flex 
        items-center px-3 justify-between"
        >
          <div className="flex flex-row">
          <img src={postsList![postIndex!].authorProfilePic} className="w-[25px] h-[25px] mr-2 rounded-full border-[2px] border-yellow-700"/>
            <p className="text-white">{postsList![postIndex!].authorUsername}</p>
          </div> 
          <PostLike
            postsList={postsList}
            setPostsList={setPostsList}
            postIndex={postIndex}
          />  
          <div className="text-white flex flex-row justify-center items-center mt-1">
            <ChatBubbleOutlineIcon sx={{fill:"white", fontSize:22}}/>
            <p className="pb-1 pl-1">{postsList![postIndex!].commentsCount}</p>
          </div>
          <div/>
          <CloseIcon
            onClick={() => setPostIndex(null)}
            sx={{ fill: "white", fontSize: 20 }}
            className="hover:bg-gray-500/40 cursor-pointer rounded-full"
          />
        </div>
        <div className="text-white pl-4 border-b-[1px] border-yellow-700/50 py-1">
          {postsList![postIndex!].description}
        </div>
        <SubmitComment
          postsList={postsList}
          setPostsList={setPostsList}
          postIndex={postIndex}
        /> 
        <div className="w-full">
          {postsList?.[postIndex!].comments?.map((comment, index) => (
              <CommentsWindow 
                comment={comment}
                index={index}
                postsList={postsList}
                setPostsList={setPostsList}
                postIndex={postIndex}
              />
            ))}
        </div>
      </div>
    </div>
  </div>
  </Slide>
  </ClickAwayListener>
  )
}
