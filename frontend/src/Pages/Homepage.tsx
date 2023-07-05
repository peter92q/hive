import CreatePostWidget from "../Components/HomePage/CreatePostWidget";
import ProfileWidget from "../Components/HomePage/ProfileWidget";
import { useEffect, useRef, useState } from "react";
import Posts from "../Components/HomePage/Posts";
import SuggestedUsers from "../Components/HomePage/SuggestedUsers";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const styles = 
{
  mainContainer: `flex flex-col overflow-y-scroll p-1 sm:p-2`,
  widgetsContainer: `flex sm:flex-row-reverse flex-col sm:translate-x-[-35px]`,
  widgetsSubContainer: `flex flex-col sm:ml-4 mt-[1.5rem] sm:w-[35%] bg-black text-white`,
  widgetsSubContainer2: `flex flex-col w-[100%] sm:w-[55%] mt-[1.5rem]`,
  scrollButton: ``,
}
 
export default function Homepage() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setShowScrollButton(scrollTop > 200);
      }
    };
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth", 
      });
    }
  };

  return (  
      <main className={styles.mainContainer} ref={containerRef}>

       <div className={styles.widgetsContainer}>
        <div className={styles.widgetsSubContainer}>
          <ProfileWidget/>   
          <SuggestedUsers/>
        </div>
        <div className={styles.widgetsSubContainer2}>
            <CreatePostWidget />  
            <Posts containerRef={containerRef}/> 
        </div>    
      </div>
      {showScrollButton && 
      <div className="fixed bottom-5 left-3 z-50 bg-black border-[1px] border-yellow-700/50
       text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
        <KeyboardArrowUpIcon
        onClick={scrollToTop}
        />
        </div>
      } 
    </main> 

  );
}
