import React, { SetStateAction, useEffect } from "react";
import { InboxMessageProps } from "../../../Configs/Types/Types";
import { useAppSelector } from "../../../Configs/Redux/store";
import { styles } from "./MessageCardStyles";

export default function MessageCard({
  message,
  index,
  setRecipient,
}: {
  message: InboxMessageProps;
  index: number;
  setRecipient: React.Dispatch<SetStateAction<string | null>>;
}) {
  const { user } = useAppSelector((state) => state.account);

  useEffect(() => {
    const receiver = (
      (message.userIdA === user?.id && message.userIdB) ||
      (message.userIdB === user?.id && message.userIdA)
    ).toString();
    setTimeout(() => {
      setRecipient(receiver);
    }, 300);
  }, []);

  return (
    <>
      {message.sentBy === user?.id ? (
        <div className={styles.mainContainer}>
          <img src={user.profilePictureUrl} className={styles.image} />
          <div key={index} className={styles.rightChatBubble}>
            <div className={styles.firstNameAndTimeStamp}>
              <p className="responsive-text2">{user.firstName}</p>
              <p className="text-[12px]">{message.timestamp}</p>
            </div>
            <div className={styles.content}>
              <p className="responsive-text3">{message.content}</p>
              <div className="w-[9%]" />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.leftChatBubbleContainer}>
          <img src={message.userPicA} className={styles.userImage} />
          <div key={index} className={styles.leftChatBubble}>
            <div className={styles.subContainer}>
              <p className="responsive-text2">
                {(message.userIdA === user?.id && message.firstNameUserB) ||
                  (message.userIdB === user?.id && message.firstNameUserA)}
              </p>
              <p className="text-[12px]">{message.timestamp}</p>
            </div>
            <div className={styles.contentWrapper}>
              <p className="responsive-text3">{message.content}</p>
              <div className="w-[9%]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
