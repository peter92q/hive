import PostCard from "./PostCard";
import { MutableRefObject, useEffect, useState } from "react";
import { loadMorePosts } from "../../Configs/Redux/post";
import { debounce } from "@mui/material/utils";
import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";

export default function Posts(
  { 
    containerRef
  }
  : 
  {
    containerRef: MutableRefObject<HTMLElement | null>;
  }
) {
  const dispatch = useAppDispatch();
  const [noMorePosts, setNoMorePosts] = useState(false);
  const { posts } = useAppSelector((state) => state.post);
  
  async function fetchPosts() {
    const newPosts = await dispatch(
      loadMorePosts({ skip: posts.length, take: 2 })
    ).unwrap();
    if (newPosts.length === 0) {
      setNoMorePosts(true);
    }
  }

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  const handleScroll = debounce(() => {
    const container = containerRef.current as HTMLElement;
    if (
      container?.scrollTop + container?.clientHeight >=
      container?.scrollHeight
    ) {
      fetchPosts();
    }
  }, 200);

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="mt-3 rounded-md flex flex-col">
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
      {noMorePosts && <div className="w-full flex items-center text-center justify-center text-white"><p>No more posts to load...</p></div>}
      <div className="block md:hidden w-full h-[15vh]"></div>
    </div>
  );
}
