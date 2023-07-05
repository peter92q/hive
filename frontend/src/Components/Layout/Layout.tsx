
import React, { useCallback, useEffect } from "react";
import Sidenav from "./Sidenav";
import HorizontalNav from "./HorizontalNav";
import { useAppDispatch } from "../../Configs/Redux/store"; 
import Cookies from 'js-cookie';
import { fetchCurrentUser } from "../../Configs/Redux/account";

const styles = 
{
  mainContainer: `min-h-[100vh] flex justify-center relative overflow-y-hidden`,
  subContainer: `flex flex-col sm:flex-row fixed overflow-x-hidden translate-y-[-25px] sm:translate-y-[0px]`, 
  widgetsWrapper: `w-[100vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] 
  xl:w-[70vw] h-screen md:h-[93vh] mt-[12px] sm:translate-x-[-8px] 
  flex flex-col bg-black border-t-[1px] border-b-[1px] border-l-0 border-r-0 
  sm:border-l-[1px] sm:border-r-[1px] border-yellow-700/40 overflow-y-scroll scrollable-container` 
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const initApp = useCallback(async () => {
    const cookieUser = Cookies.get('user');
    if (cookieUser) {
      try {
        await dispatch(fetchCurrentUser());
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [dispatch]);
 
  useEffect(() => {
    initApp();
  }, [initApp]);

  return (
    <div
      className={styles.mainContainer}
      style={{
        backgroundImage: "url('/bg.png')"
      }}
      >
      <div className={styles.subContainer}>
        <Sidenav/> 
        <div 
          className={styles.widgetsWrapper}
        >  
         <HorizontalNav/>
          {children}
        </div>
      </div>
    </div>
  );
}
