export const styles = {
  formContainer: `w-full sm:h-full flex md:flex-row flex-col overflow-y-auto lg:overflow-hidden`,
  backIcon: `text-white flex justify-start items-start w-full px-2`,
  mainContainer: `w-full bg-black border-r-[1px] border-yellow-700/50`,
  inbox: `text-white font-medium py-1 px-1 border-b-[1px] border-yellow-700/50`,
  emptyInbox: `text-white text-center mt-2 text-[20px]`,
  messagesContainer: `h-[80vh] sm:h-[72vh] md:h-[80vh] w-full flex flex-col justify-end items-end`,
  messagesSubContainer: `w-full h-full flex flex-col overflow-y-scroll`,
  messagesWrapper: `flex flex-row w-full px-2 chat-container`,
  textArea: `w-full text-[20px] px-2 outline-0 border-[1px] border-yellow-700/50 bg-gray-800
  text-white focus:border-yellow-600`,
  buttonWrapper: `border-yellow-700/70 border-[1px] p-1 flex justify-center items-center bg-black`,
  icon: `z-10 bg-yellow-600 rounded-full p-1 cursor-pointer hover:opacity-80`,
};