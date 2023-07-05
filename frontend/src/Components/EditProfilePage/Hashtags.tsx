import { SetStateAction, useState } from "react";
import { htags, randomColor } from "../../Configs/staticData";

const styles = {
    subContainer: `mt-1 text-[18px]`,
    pText: ` text-white border-t-[1px] border-b-[1px] sm:border-r-[1px]
     sm:border-l-[1px] border-yellow-700/50 px-1 mb-2`,
    hashtagStyle: `text-white rounded-xl px-2 text-[14px] pb-[1px] border-[1px] 
    border-white/10 font-medium`,
  };

export default function Hashtags(
    {
        hashtags,
        setHashtags,
    }:
    {
        hashtags: string[];
        setHashtags: React.Dispatch<SetStateAction<string[]>>;
    }
) {
    const [number, setNumber] = useState<number>(0);

    const handleHashtagSelect = (selectedHashtag: string) => {
        if (hashtags.length < 5 && !hashtags.includes(selectedHashtag)) {
          setHashtags([...hashtags, selectedHashtag]);
          if (number <= 5) {
            setNumber(number + 1);
          }
        }
        console.log(hashtags);
      };
    
      const handleHashtagRemove = (removedHashtag: string) => {
        setHashtags((prevHashtags) =>
          prevHashtags.filter((hashtag) => hashtag !== removedHashtag)
        );
        if (number <= 5 && number > 0) {
          setNumber(number - 1);
        }
        console.log(hashtags);
      };

      setTimeout(()=>{
        setNumber(hashtags.length)
      },500)
    
  return (
    <div className={styles.subContainer}>
    <p className={styles.pText}>Select Hashtags</p>
    <div className="px-4">
      {htags.map((hashtag) => (
        <button
          key={hashtag}
          type="button"
          onClick={() => handleHashtagSelect(hashtag)}
          disabled={hashtags.length >= 5 || hashtags.includes(hashtag)}
          className="mr-4"
        >
          {!hashtags.includes(hashtag) && (
            <span
              className={`${
                randomColor[
                  Math.floor(Math.random() * randomColor.length)
                ]
              }
          ${styles.hashtagStyle}`}
            >
              +{hashtag}
            </span>
          )}
        </button>
      ))}
    </div>

    <div className="mt-4 text-[18px]">
      <p className={styles.pText}>
        Selected Hashtags{" "}
        <span className="text-gray-300">( {number} / 5 )</span>
      </p>
      <div className="px-4 pb-2">
        {hashtags.map((hashtag) => (
          <button
            key={hashtag}
            type="button"
            onClick={() => handleHashtagRemove(hashtag)}
            className={`${
              randomColor[Math.floor(Math.random() * randomColor.length)]
            } 
            ${styles.hashtagStyle} mr-1 mb-[2px]`}
          >
            -{hashtag}
          </button>
        ))}
      </div>

    </div>
  </div>
  )
}
